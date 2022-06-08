/*
 * UART.c
 *
 * Created: 20/04/2022 14.03.06
 *  Author: Simon Phi Dang
 */ 
#include <avr/io.h>
#include <stdio.h>

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

void debugUART(int x, int y, int z )
{
	//Lav int til string
	char x_string[100];
	sprintf(x_string, "X axis: %d \n", x);
	
	char y_string[100];
	sprintf(y_string, "Y axis: %d \n", y);
	
	char z_string[100];
	sprintf(z_string, "Z axis: %d \n", z);
	//Send string til uart
	sendString(x_string);
	sendString(y_string);
	sendString(z_string);
}