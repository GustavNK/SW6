/*
 * TouchScreenDriver.c
 *
 * Created: 06/04/2022 13.02.48
 *  Author: Simon Phi Dang
 */ 
#include <avr/io.h>
#define F_CPU 16000000
#include <util/delay.h>
#include "TouchScreenDriver.h"

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

#define BITON(port,bit) port |= 1<<bit
#define BITOFF(port,bit) port &= ~(1<<bit)

void TouchScreenInit(){
	//0 = input, 1 = output
	//Set ports
	BITON(DDRE,CS_BIT);
	BITON(DDRH,CLK_BIT);
	BITON(DDRG,DIN_BIT);
	BITOFF(DDRE,DOUT_BIT);
	//DIN 7 startBit = high for start af controlByte(DIN)
	BITOFF(IRQ_PORT,IRQ_BIT);
	
	BITOFF(CS_PORT,CS_BIT);
	
	
}

unsigned long TouchScreenRead(unsigned char* x, unsigned char* y){
	
}