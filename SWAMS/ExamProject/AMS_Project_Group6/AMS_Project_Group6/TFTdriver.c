/************************************************************
  File name: "TFTdriver.c"

  Driver for "ITDB02 320 x 240 TFT display module, Version 2"
  mounted at "ITDB02 Arduino Mega2560 Shield".
  Display controller = ILI 9341.
  
  Max. uC clock frequency = 16 MHz (Tclk = 62,5 ns)

  Connections:
  DB15-DB8:   PORT A
  DB7-DB0:    PORT C

  RESETx:     PORT G, bit 0
  CSx:        PORT G, bit 1
  WRx:        PORT G, bit 2
  RS (=D/Cx): PORT D, bit 7

  Henning Hargaard, February 14, 2019
************************************************************/  
#include <avr/io.h> 
#include <avr/cpufunc.h>
#define F_CPU 16000000
#include <util/delay.h>
#include "TFTdriver.h"
#include "trashArt.h"

// Data port definitions:
#define DATA_PORT_HIGH PORTA
#define DATA_PORT_LOW  PORTC

// Control port definitions:
#define WR_PORT PORTG
#define WR_BIT 2
#define DC_PORT PORTD
#define DC_BIT  7  //"DC" signal is at the shield called RS
#define CS_PORT PORTG
#define CS_BIT  1
#define RST_PORT PORTG
#define RST_BIT 0

#define TURNON |= 1<<
#define TURNOFF &= ~1<<

#define BitOn(port, bit) port |= 1<<bit;
#define BitOff(port,bit) port &= ~(1<<bit);
int noWriteX;

// LOCAL FUNCTIONS /////////////////////////////////////////////////////////////

// ILI 9341 data sheet, page 238
void WriteCommand(unsigned char command)
{
	BitOff(CS_PORT,CS_BIT);
	BitOff(DC_PORT,DC_BIT);
	BitOff(WR_PORT,WR_BIT);
	
	DATA_PORT_LOW = command;
	
	BitOn(WR_PORT,WR_BIT);
	BitOn(DC_PORT,DC_BIT);
	BitOn(CS_PORT,CS_BIT);
}

// ILI 9341 data sheet, page 238
void WriteData(unsigned int data)
{
	DATA_PORT_HIGH = data>>8;
	DATA_PORT_LOW = data;	
	BitOn(DC_PORT,DC_BIT);
	BitOff(CS_PORT,CS_BIT);
					
	BitOff(WR_PORT,WR_BIT);
	_NOP();
	BitOn(WR_PORT,WR_BIT);
	//Wait 100 ms -> 0.5s
	_NOP();

}



// PUBLIC FUNCTIONS ////////////////////////////////////////////////////////////

// Initializes (resets) the display
void DisplayInit(int menuX)
{
	noWriteX = menuX;
	DDRA |= 0xFF;
	DDRC |= 0xFF;
	DDRG |= 1<<CS_BIT | 1<<RST_BIT | 1<<WR_BIT;
	DDRD |= 1<<DC_BIT;
	
	PORTG |= 0b00000111;
	PORTD |= 0b10000000;
	//Reset 
	BitOff(RST_PORT,RST_BIT);	
	_delay_ms(500);
	//RST_PORT |= 1<<RST_BIT;
	BitOn(RST_PORT,RST_BIT);
	_delay_ms(130);
	
	SleepOut();
	
	DisplayOn();
	
	MemoryAccessControl(0b00001000);
	
	InterfacePixelFormat(0b00000101);
}

void DisplayOff()
{
	WriteCommand(0x28);
}

void DisplayOn()
{
	WriteCommand(0x29);
}

void SleepOut()
{
	WriteCommand(0x11);
}

void MemoryAccessControl(unsigned char parameter)
{
	WriteCommand(0x36);
	WriteData(parameter);
}

void InterfacePixelFormat(unsigned char parameter)
{
	//D0 = 1 D1 = 0 DB2 = 1
	WriteCommand(0x3A);
	WriteData(parameter);
	
}

void MemoryWrite()
{
	WriteCommand(0x2C);
}

// Red 0-31, Green 0-63, Blue 0-31
void WritePixel(unsigned char Red, unsigned char Green, unsigned char Blue)
{
	WriteData(((unsigned int)Red<<11) | ((unsigned int)Green<<5) | Blue);
}

// Set Column Address (0-239), Start > End
void SetColumnAddress(unsigned int Start, unsigned int End)
{
	WriteCommand(0x2A);
	WriteData(Start>>8);
	WriteData(Start);
	WriteData(End>>8);
	WriteData(End);
}

// Set Page Address (0-319), Start > End
void SetPageAddress(unsigned int Start, unsigned int End)
{
	if(Start <= 319 - noWriteX)
	{
		WriteCommand(0x2B);
		WriteData(Start>>8);
		WriteData(Start);
		WriteData(End>>8);
		WriteData(End);
	}
}

void FillPixel(unsigned int x, unsigned int y, unsigned char Red, unsigned char Green, unsigned char Blue)
{
	SetPageAddress(y,y+1);
	SetColumnAddress(x,x+1);
	MemoryWrite();
	
	WritePixel(Red,Green,Blue);
}

// Fills rectangle with specified color
// (StartX,StartY) = Upper left corner. X horizontal (0-319) , Y vertical (0-239).
// Height (1-240) is vertical. Width (1-320) is horizontal.
// R-G-B = 5-6-5 bits.
void FillRectangle(unsigned int StartX, unsigned int StartY, unsigned int Width, unsigned int Height, 
unsigned char Red, unsigned char Green, unsigned char Blue)
{
	// Set page address
	WriteCommand(0x2B);
	WriteData(StartX>>8);
	WriteData(StartX);
	WriteData((StartX + Width)>>8);
	WriteData((StartX + Width));
	//SetPageAddress(StartX,StartX+Width);
	SetColumnAddress(StartY,StartY+Height);
	MemoryWrite();
	for (unsigned long i=0; i<((unsigned long)(Width+1)*(Height+1)); i++)
	{
		WritePixel(Red,Green,Blue);
	}
}



void drawCircle(int xc, int yc, int x, int y, unsigned char Red, unsigned char Green, unsigned char Blue)
{
	for (int i = -x; i < x; i++)
	{
		for (int j = -y; j < y; j++)
		{
			FillPixel(xc+i, yc+j, Red, Green, Blue);
		}
	}
}

// Function for circle-generation
// using Bresenham's algorithm
void circleBres(int xc, int yc, int r, unsigned char Red, unsigned char Green, unsigned char Blue)
{
	int x = 0, y = r;
	int d = 3 - 2 * r;
	drawCircle(xc, yc, x, y, Red, Green, Blue);
	while (y >= x)
	{
		// for each pixel we will
		// draw all eight pixels
		x++;
		
		// check for decision parameter
		// and correspondingly
		// update d, x, y
		if (d > 0)
		{
			y--;
			d = d + 4 * (x - y) + 10;
		}
		else
		d = d + 4 * x + 6;
		drawCircle(xc, yc, x, y, Red, Green, Blue);
	}
}


void DrawCircle(unsigned int StartX, unsigned int StartY, unsigned int radius,
unsigned char Red, unsigned char Green, unsigned char Blue)
{
	//int radius = radius + (1 - radius%2);
	//int diameter = radius * 2 + 1;
	//
	//SetPageAddress(StartX,StartX + radius);
	//SetColumnAddress(StartY,StartY + radius);
	//MemoryWrite();
	//
	//for (unsigned long i=0; i<((unsigned long)(diameter+1)*(diameter+1)); i++)
	//{
	//	if 
	//	WritePixel(Red,Green,Blue);
	//}
	for(int y=-radius; y<=radius; y++)
	{
		for(int x=-radius; x<=radius; x++)
		{
			if(x*x+y*y <= radius*radius)
			{
				FillPixel(StartX+x, StartY+y, 0, 0,31);
			}
		}
	}
}

void drawIcon(unsigned int StartX, unsigned int StartY)
{

	// Set page address
	WriteCommand(0x2B);
	WriteData(StartX>>8);
	WriteData(StartX);
	WriteData((StartX + 39)>>8);
	WriteData((StartX + 39));
	//SetPageAddress(StartX,StartX+Width);
	SetColumnAddress(StartY,StartY+39);
	MemoryWrite();

	for(int x=0; x<40; x++)
	{
		for(int y=0; y<40; y++)
		{
			if(trashCan[y][x] == 0)
			{
				WritePixel(31, 61,31);
			}
			else
			{
				WritePixel(0, 0, 0);
			}
			
		}
	}

}
