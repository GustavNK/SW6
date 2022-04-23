/*
 * quickUART.c
 *
 * Created: 2022-04-20 12:51:55
 * Author : GustavNørgaardKnudse
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

int main(void)
{
    /* Replace with your application code */
    while (1) 
    {
		initUART();
		sendString("Hello world");
    }
}


