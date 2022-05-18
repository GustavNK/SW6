/*
 * AMS_Project_Group6.c
 *
 * Created: 27/04/2022 13.08.20
 * Author : Simon Phi Dang
 */ 

#include <avr/io.h>
#include <avr/interrupt.h>
#include <math.h>
#define F_CPU 16000000
#include "TouchDisplayDriver.h"
#include "InteruptTimer.h"
#include <stdio.h>
#include "UART.h"
#include <util/delay.h>
#include "TFTdriver.h"
#define X_PLATE_RES 255
#define Y_PLATE_RES 255
#define MENU_X_HEIGHT 20

unsigned int formatX(unsigned int x);
unsigned int formatY(unsigned int y);
void debugUART();

int main(void)
{
	// Global interrupt enable
	sei();
	initTimer0();
	
	DisplayInit(MENU_X_HEIGHT);
	initTouchDisplay();
	initUART();
	DDRB = 0xFF;
	PORTB = 0;
	
	unsigned char green[3] = {0,61,0};
	unsigned char red[3] = {31,0,0};
	unsigned char blue[3] = {0,0,31};
	unsigned char yellow[3] = {31,61,0};
	unsigned char currentColor = 1;

	unsigned char* colors[4] = {
	&green,
	&red,
	&blue,
	&yellow
	};
	// Fills rectangle with specified color
	// (StartX,StartY) = Upper left corner. X horizontal (0-319) , Y vertical (0-239).
	// Height (1-240) is vertical. Width (1-320) is horizontal.
	// R-G-B = 5-6-5 bits.	
	
	// Draw white background 
	FillRectangle(0,0,320,240,31,61,31);
	
	//Fill blue for reset button
	FillRectangle(300,180,20,60,0,0,31);  
	
	//Fill green for inital color picker
	FillRectangle(300,0,20,60,0,61,0);
    while (1)
	{
	    //Writebyte x position (startbit 1, x position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
	    writeByte(0b11011011);
	    //Read x position
	    unsigned char resultX = readByte();
	    //Writebyte y position (startbit 1, y position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
	    writeByte(0b10011011);
	    //read y position
	    unsigned char resultY = readByte();
		//z1 = 011
		writeByte(0b10111011);
		unsigned char resultZ1 = readByte();
	    //Lav unsigned char om til int
	    unsigned int x = (int)resultX;
	    unsigned int y = (int)resultY;
	    unsigned int z1 = (int)resultZ1;
		
		debugUART(x, y);

		unsigned int Rtouch = (X_PLATE_RES*x/256) *((256/z1)-1) - Y_PLATE_RES * (1-(y/256));
		//char z_string[100];
		//sprintf(z_string, "Z Res: %u \n", Rtouch);
		//sendString(z_string);
		
		unsigned int size;
		//Hårdt ca 150
		//Blødt ca 800-900
		
		if(Rtouch < 1500)
		{
			// Rest button
			if(20 < x && x < 60 && 20 < y && y < 30 )
			{
			   FillRectangle(0,0,300,240,31,61,31);
			}
			// Change color button
			else if(180 < x && x < 255 && 10 < y && y < 40 && busy())
			{
				setBusy();
				currentColor >= (sizeof colors / sizeof colors[0])-1 ? currentColor = 0 : currentColor++;
				FillRectangle(300,0,20,60,
				colors[currentColor][0],colors[currentColor][1],colors[currentColor][2]);
			}
			// D
			else if(y>20 && busy())
			{
				size = 1 + (int)pow(((1500-Rtouch)*0.002),2);
				circleBres(formatX(x), formatY(y), size, colors[currentColor][0],colors[currentColor][1],colors[currentColor][2]);    // function call
				//DrawCircle(formatX(x),  formatY(y), size, colors[currentColor][0],colors[currentColor][1],colors[currentColor][2]);
			}

		}
    }
}

unsigned int formatX(unsigned int x)
{
	//touch max 245
	// graphic max 240
	if(x > 240){
		x = 240;
	}
	return 240 - x;
}



unsigned int formatY(unsigned int y)
{
	//touch max 245
	//Graphic max 320
	float temp =((float)y * (320.0/240.0) - 15);
	return 320 - (unsigned int)temp;
	
}

void debugUART(unsigned int x, unsigned int y)
{
	//Lav int til string
	char x_string[100];
	sprintf(x_string, "X axis: %d \n", x);
	
	char y_string[100];
	sprintf(y_string, "Y axis: %d \n", y);
	//Send string til uart
	sendString(x_string);
	sendString(y_string);
}



