/*
 * TouchDisplayDriver.c
 *
 * Created: 06-04-2022 10:26:27
 * Author : Rasmus
 */ 
#define F_CPU 16000000
#include <avr/io.h>
#include "TouchDisplayDriver.h"
#include <stdio.h>
#include "UART.h"
#include <util/delay.h>

int main(void)
{
	initTouchDisplay();
	initUART();
	DDRB = 0xFF;
	PORTB = 0;
	
	
    while (1) 
    {
		_delay_ms(100);
		//Writebyte x position (startbit 1, x position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
		sendString("\nSend X:");
		writeByte(0b11011011);
		
		//Read x position
		unsigned char resultX = readByte();
		
		//Writebyte y position (startbit 1, y position, mode 8bit, SER/DFR = low, PD1,PD0 = all on)
		sendString("\nSend Y:");
		writeByte(0b10011011);
		//read y position
		unsigned char resultY = readByte();
		
		//if(resultX && resultY)
		//{
			//Lav unsigned char om til int 
			int x = (int)resultX;
			int y = (int)resultY;
			
			//Lav int til string
			char x_string[100];
			sprintf(x_string, "X axis: %d \n", x);

			char y_string[100];
			sprintf(y_string, "Y axis: %d \n", y);
			//Send string til uart
			sendString(x_string);
			sendString(y_string);
		//}
		//else{
		//	PORTB = 0;
		//}
		
		
    }
}

