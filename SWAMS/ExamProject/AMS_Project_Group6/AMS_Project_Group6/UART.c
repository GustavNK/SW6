/*
 * UART.c
 *
 * Created: 20/04/2022 14.03.06
 *  Author: Simon Phi Dang
 */ 
#include <avr/io.h>

void initUART()
{
	UCSR0A = 0b00100000;
	UCSR0B = 0b00011000;
	UCSR0C = 0b00000110;
	UBRR0 = (16000000 + (8*115200))/(16*115200)-1;
}

void sendChar(char c)
{
	while ((UCSR0A & (1<<5)) == 0) {}
	UDR0 = c;
}

void sendString (char* Streng)
{
	while(*Streng != 0)
	{
		sendChar(*Streng);
		Streng++;
	}
}
