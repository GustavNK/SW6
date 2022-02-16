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

#define BitOn(port, bit) port |= 1<<bit
#define BitOff(port,bit) port &= ~(1<<bit)

// LOCAL FUNCTIONS /////////////////////////////////////////////////////////////

// ILI 9341 data sheet, page 238
void WriteCommand(unsigned int command)
{
	BitOff(DC_PORT,DC_BIT);
	BitOff(CS_PORT,CS_BIT);
	BitOff(WR_PORT,WR_BIT);
		
	DATA_PORT_HIGH |= command>>8;
	DATA_PORT_LOW |= command;

	BitOn(WR_PORT,WR_BIT);
	//Wait atleast 10 ns -> 1NOP = 62.5 ns
	_NOP();
	BitOn(CS_PORT,CS_BIT);
	BitOn(DC_PORT,DC_BIT);
}

// ILI 9341 data sheet, page 238
void WriteData(unsigned int data)
{
			BitOff(CS_PORT,CS_BIT);
						
			//Højeste 8 bit			
			BitOff(WR_PORT,WR_BIT);
			DATA_PORT_LOW |= data>>8;
			BitOn(WR_PORT,WR_BIT);
			//Wait 100 ms -> 0.5s
			
			//laveste 8 bit
			BitOff(WR_PORT,WR_BIT);
			DATA_PORT_LOW |= data;
			BitOn(WR_PORT,WR_BIT);
			
			BitOn(CS_PORT,CS_BIT);
}



// PUBLIC FUNCTIONS ////////////////////////////////////////////////////////////

// Initializes (resets) the display
void DisplayInit()
{
	//Reset 
	RST_PORT |= 1<<RST_BIT;
	_delay_us(200);
	//10001
	WriteCommand(0x11);

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
}

void InterfacePixelFormat(unsigned char parameter)
{
	//D0 = 1 D1 = 0 DB2 = 1
	WriteCommand(parameter);
	
}

void MemoryWrite()
{
	WriteCommand(0x2C);
}

// Red 0-31, Green 0-63, Blue 0-31
void WritePixel(unsigned char Red, unsigned char Green, unsigned char Blue)
{
}

// Set Column Address (0-239), Start > End
void SetColumnAddress(unsigned int Start, unsigned int End)
{
	WriteCommand(0x2A);
	WriteData(Start);
	WriteData(End);
}

// Set Page Address (0-319), Start > End
void SetPageAddress(unsigned int Start, unsigned int End)
{
	WriteCommand(0x2B);
	WriteData(Start);
	WriteData(End);	
}

// Fills rectangle with specified color
// (StartX,StartY) = Upper left corner. X horizontal (0-319) , Y vertical (0-239).
// Height (1-240) is vertical. Width (1-320) is horizontal.
// R-G-B = 5-6-5 bits.
void FillRectangle(unsigned int StartX, unsigned int StartY, unsigned int Width, unsigned int Height, unsigned char Red, unsigned char Green, unsigned char Blue)
{
}