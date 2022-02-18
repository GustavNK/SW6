/*
 * main.c
 *
 * Created: 09/02/2022 13.39.16
 *  Author: Simon Phi Dang
 */ 
#include "lcd162.h"
#include <avr/io.h>

const unsigned char capital_ae[8]= {
	0b0001111,
	0b0010100,
	0b0010100,
	0b0011111,
	0b0010100,
	0b0010100,
	0b0010111,
0b0000000};
const unsigned char capital_oe[8]= {
	0b0001110,
	0b0010001,
	0b0010011,
	0b0010101,
	0b0011001,
	0b0010001,
	0b0001110,
0b0000000};
const unsigned char capital_aa[8]= {
	0b0000100,
	0b0001110,
	0b0010001,
	0b0011111,
	0b0010001,
	0b0010001,
	0b0010001,
0b0000000};
const unsigned char minor_ae[8]= {
	0b0000000,
	0b0000000,
	0b0001110,
	0b0010101,
	0b0010101,
	0b0010101,
	0b0001111,
0b0000000};
const unsigned char minor_oe[8]= {
	0b0000000,
	0b0000000,
	0b0001110,
	0b0010011,
	0b0010101,
	0b0011001,
	0b0001110,
0b0000000};
const unsigned char minor_aa[8]= {
	0b0000100,
	0b0000000,
	0b0001110,
	0b0010010,
	0b0010010,
	0b0010010,
	0b0001101,
0b0000000};




int main(void)
{
	LCDInit();
	
	LCDLoadUDC(0, minor_oe);
	
	LCDDispChar(0);

	while(1)
	{
	}
}