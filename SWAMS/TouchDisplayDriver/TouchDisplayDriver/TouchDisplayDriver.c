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
#define BITON(port, bit) port |= 1<<bit
#define BITOFF(port, bit) port &= ~(1<<bit)

// Ports
#define DIN_PORT PORTG
#define DIN_BIT 5
#define DOUT_PORT PORTE
#define DOUT_BIT 5
#define CS_PORT PORTE
#define CS_BIT 3
#define CLK_PORT PORTH
#define CLK_BIT 3
#define IRQ_PORT PORTE
#define IRQ_BIT 4



void initTouchDisplay(){
	// 0 = input , 1 = output
	// Set ports to correct in/out-put
	DDRE = 1<<3; // PE3 as output all else as input
	DDRH = 0xFF; // all outputs
	DDRG = 0xFF; // all outputs
	
	BITOFF(PORTE, 3); // CS is Active low so we turn it off
}

void writeByte(unsigned char input){
	
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
		// Hit clock (Aka Yep Cock)
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
	// After write busy flag is ready after max 200ns so we wait a bit before possible read
	_NOP();
	_NOP();
	_NOP();
	// ~175ns
}
unsigned char readByte(){
	unsigned char output = 0;
	for (int i = 7; i >= 0; i--)
	{
		// read bit into byte
		output = output<<1 | (DOUT_PORT & 1 << DOUT_BIT);
		// Hit clock (Aka Yep Cock)
		_NOP();
		_NOP(); // ~125 ns
		// Hit clock (Aka Yep Cock)
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
	return output;
}