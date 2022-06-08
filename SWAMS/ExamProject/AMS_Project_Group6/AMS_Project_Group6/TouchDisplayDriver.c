/*
 * TouchDisplayDriver.c
 *
 * Created: 06-04-2022 10:29:05
 *  Author: Rasmus
 */ 

#include <avr/io.h>
#define F_CPU 16000000
#include <util/delay.h>
#include <avr/cpufunc.h>
#include "UART.h"
#include <stdio.h>

#define BITON(port, bit) port |= 1<<bit
#define BITOFF(port, bit) port &= ~(1<<bit)

// Ports
#define DIN_PORT PORTG
#define DIN_BIT 5
#define DOUT_PORT PINE
#define DOUT_BIT 5
#define CS_PORT PORTE
#define CS_BIT 3
#define CLK_PORT PORTH
#define CLK_BIT 3
#define IRQ_PORT PORTE
#define IRQ_BIT 4

#define X_PLATE_RES 255
#define Y_PLATE_RES 255



void initTouchDisplay(){
	// 0 = input , 1 = output
	// Set ports to correct in/out-put
	DDRE = 1<<3; // PE3 as output all else as input
	DDRH = 0xFF; // all outputs
	DDRG = 0xFF; // all outputs
	
	BITON(PORTE, 3); // CS is Active low so we turn it ON
}

void writeByte(unsigned char input){
	//Turn CS to LOW for at begynde 
	BITOFF(PORTE,3);
	for (int i = 7; i >= 0; i--)
	{
		// Set bit to input at correct index
		if((input & (1<<i))){
			BITON(DIN_PORT, DIN_BIT);
		}else{
			BITOFF(DIN_PORT, DIN_BIT);
		}
		// MIN 100ns wait before correct read
		_NOP();
		_NOP(); // ~125 ns
		// Hit clock 
		BITON(CLK_PORT, CLK_BIT);
		// MIN 200 ns wait
		_NOP();
		_NOP();
		_NOP();
		_NOP(); // ~250 ns
		BITOFF(CLK_PORT, CLK_BIT);
		_NOP(); // May be removed to increase performance 
				// if for loop increment and beginning if statement is longer than 100 ns
	}
	//sendChar('\n');
	// After write busy flag is ready after max 200ns so we wait a bit before possible read
	_NOP();
	_NOP();
	_NOP();
	// ~175ns
}

unsigned char readByte(){
	//sendString("ReadByte: ");
	unsigned char output = 0;
	
	for (int i = 8; i >= 0; i--)
	{
		// read bit into byte
		unsigned char resultInput = (DOUT_PORT & (1 << DOUT_BIT)) >> 5;
		if(i!=8){
			//sendChar( 48 + resultInput);
		}
		output = output<<1 | resultInput;
		// Hit clock 
		_NOP();
		_NOP(); // ~125 ns
		// Hit clock 
		BITON(CLK_PORT, CLK_BIT);
		// MIN 200 ns wait
		_NOP();
		_NOP();
		_NOP();
		_NOP(); // ~250 ns
		BITOFF(CLK_PORT, CLK_BIT);
		// Wait 200 ns for valid read
		_NOP();
		_NOP();
		_NOP();
		_NOP(); // ~250ns
	}
	//sendChar('\n');
	//S�t CS TIL ON
	BITON(PORTE,3);
	return output;
}

unsigned char getX()
{
	writeByte(0b11011011);
	//Read x position
	return readByte();
	
}

unsigned char getY()
{
	writeByte(0b10011011);
	//Read y position
	return readByte();
	
}

unsigned char getZ()
{
	writeByte(0b10111011);
	//Read z position
	return readByte();
}

struct Position 
{
	int x;
	int y;
	int z;	
};
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
struct Position getPosition()
{
	unsigned int _x = (int)getX();
	unsigned int _y = (int)getY();
	unsigned int _z = (int)getZ();
	int rTouch = (X_PLATE_RES*_x/256) *((256/_z)-1) - Y_PLATE_RES * (1-(_y/256));
	
	char string[100];
	sprintf(string, "rTouch axis: %d \nZ Value: %d\n", rTouch, _z);
	//Send string til uart
	sendString(string);
	
	struct Position p ;
	p.x= formatX(_x);
	p.y=formatY(_y);
	p.z = rTouch;
	return p;
}

