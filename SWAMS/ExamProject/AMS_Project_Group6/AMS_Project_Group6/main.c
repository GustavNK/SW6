/*
 * AMS_Project_Group6.c
 *
 * Created: 27/04/2022 13.08.20
 * Author : Simon Phi Dang
 */ 

#include <avr/io.h>
#define F_CPU 16000000
#include "TouchDisplayDriver.h"
#include <stdio.h>
#include "UART.h"
#include <util/delay.h>
#include "TFTdriver.h"

unsigned int formatX(unsigned int x);

unsigned int formatY(unsigned int y);

int main(void)
{
	DisplayInit();
	initTouchDisplay();
	initUART();
	DDRB = 0xFF;
	PORTB = 0;
	
	// Fills rectangle with specified color
	// (StartX,StartY) = Upper left corner. X horizontal (0-319) , Y vertical (0-239).
	// Height (1-240) is vertical. Width (1-320) is horizontal.
	// R-G-B = 5-6-5 bits.	
	//FillRectangle(140,140,320-140,100,31,0,0);  
	//FillRectangle(140,140,320-140,100,31,0,0);  
    while (1)
    {
	    //_delay_ms(100);
	    //Writebyte x position (startbit 1, x position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
	    writeByte(0b11011011);
	    //Read x position
	    unsigned char resultX = readByte();
	    //Writebyte y position (startbit 1, y position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
	    writeByte(0b10011011);
	    //read y position
	    unsigned char resultY = readByte();
	    
	    //Lav unsigned char om til int
	    unsigned int x = (int)resultX;
	    unsigned int y = (int)resultY;
	    
	    //Lav int til string
	    char x_string[100];
	    sprintf(x_string, "X axis: %d \n", x);

	    char y_string[100];
	    sprintf(y_string, "Y axis: %d \n", y);
	    //Send string til uart
	    sendString(x_string);
	    sendString(y_string);
		
		FillPixel(formatX(x),formatY(y),0,63,0);
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
	float temp =((float)y * (320.0/240.0));
	return 320 - (unsigned int)temp;
	
}


