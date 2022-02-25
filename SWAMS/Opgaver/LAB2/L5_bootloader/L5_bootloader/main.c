/*
 * L5_bootloader.c
 *
 * Created: 23-02-2022 13:40:41
 * Author : GustavNørgaardKnudse
 */ 
#define F_CPU 16000000

#include <avr/io.h>
#include <util/delay.h>

#define BitOn(port, bit) port |= 1<<bit;
#define BitOff(port,bit) port &= ~(1<<bit);

int main(void)
{
	/* Replace with your application code */
	DDRB = 1<<7;  // Set led Port as write
	//BitOff(DDRE, 0); // USART0 Rx as read
	while (1)
	{
		PORTB = 0xFF; // LED on
		_delay_ms(500);
		PORTB = 0x00;  // LED off
		_delay_ms(1000);
	}
}