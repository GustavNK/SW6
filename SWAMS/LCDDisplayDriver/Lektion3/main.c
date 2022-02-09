/*
 * main.c
 *
 * Created: 09/02/2022 13.39.16
 *  Author: Simon Phi Dang
 */ 
#include "lcd162.h"
#include <avr/io.h>
int main(void)
{
	LCDInit();
	
	LCDDispChar('A');

	while(1)
	{
	}
}