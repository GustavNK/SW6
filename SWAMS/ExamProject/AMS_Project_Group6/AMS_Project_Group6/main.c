/*
 * AMS_Project_Group6.c
 *
 * Created: 27/04/2022 13.08.20
 * Author : Simon Phi Dang
 */ 

#include <avr/io.h>
#include <avr/interrupt.h>
#include <stdlib.h>
#include <math.h>
#define F_CPU 16000000
#include "TouchDisplayDriver.h"
#include "InteruptTimer.h"
#include <stdio.h>
#include "UART.h"
#include "TFTdriver.h"
#define X_PLATE_RES 255
#define Y_PLATE_RES 255
#define MENU_X_HEIGHT 40
#define DEBUG 1

// R-G-B = 5-6-5 bits.	
#define REDCOLORSCALE 31/255
#define GREENCOLORSCALE 61/255
#define BLUECOLORSCALE 31/255

struct Color
{
	unsigned char Red;
	unsigned char Green;
	unsigned char Blue;
};

// Color constructor
struct Color Color_new(unsigned char r, unsigned char g, unsigned char b){
	struct Color c = {.Red = r * REDCOLORSCALE, .Green= g * GREENCOLORSCALE, .Blue = b * BLUECOLORSCALE};
#ifdef DEBUG
	char* output = (char*)malloc(25 * sizeof(char));
	sprintf(output, "R: %d - G: %d - B: %d\n", c.Red, c.Green, c.Blue);
	sendString(output);
	free(output);
#endif
	return c;
}

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
	
	struct Color red	=	Color_new(255,0,0);
	struct Color green	=	Color_new(0,255,0);
	struct Color blue	=	Color_new(0,0,255);
	struct Color yellow	=	Color_new(255,255,0);
	unsigned char currentColor = 0;

	struct Color* colors[4] = {
	&red,
	&green,
	&blue,
	&yellow
	};
	// Fills rectangle with specified color
	// (StartX,StartY) = Upper left corner. X horizontal (0-319) , Y vertical (0-239).
	// Height (1-240) is vertical. Width (1-320) is horizontal.
	
	
	// Draw white background 
	FillRectangle(0,0,320,240,31,61,31);
	

	drawIcon(320-MENU_X_HEIGHT,200);

	//Fill green for inital color picker
	FillRectangle(320-MENU_X_HEIGHT,0,MENU_X_HEIGHT,60,colors[currentColor]->Red,colors[currentColor]->Green,colors[currentColor]->Blue);
    while (1)
	{
		struct Position pos = getPosition();
#ifdef DEBUG
		debugUART(pos.x, pos.y);
#endif
		unsigned int size;
		//Hårdt ca 150
		//Blødt ca 800-900
		if(pos.z < 1500)
		{
			// Clear canvas button
			
			if(320-MENU_X_HEIGHT < pos.y && pos.y < 320 && 0 < pos.x && pos.x < 60 && busy())
			{
				setBusy();
				FillRectangle(0,0,320-MENU_X_HEIGHT,240,31,61,31);
			}
			// Change color button
			else if(180 < pos.x && pos.x < 255 && 10 < pos.y && pos.y < 40 && busy())
			{
				setBusy();
				currentColor >= (sizeof colors / sizeof colors[0])-1 ? currentColor = 0 : currentColor++;

				FillRectangle(320-MENU_X_HEIGHT,0,MENU_X_HEIGHT,60,
				colors[currentColor]->Red,colors[currentColor]->Green,colors[currentColor]->Blue);

			}
			// Draw
			else if(pos.y>MENU_X_HEIGHT && busy())
			{
				size = 1 + (int)pow(((1500-pos.z)*0.002),2);
				//circleBres(formatX(x), formatY(y), size, colors[currentColor]->Red,colors[currentColor]->Green,colors[currentColor]->Blue);    // function call
				drawCircle(pos.x,  pos.y, size, colors[currentColor]->Red,colors[currentColor]->Green,colors[currentColor]->Blue);
			}

		}
    }
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



