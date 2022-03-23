/*
 * Test program for SD-Driver
 * Henning Hargaard 12/3 2021
 *
 */
#include <avr/io.h>
#define F_CPU 16000000
#include <util/delay.h>
#include "SD_Driver.h"
#include "uart.h"

// Arbitrary block number for test
#define Block_1 718
#define Block_2 1234567

unsigned char buffer[512];

int main(void)
{
	//Setup SD/SPI drivers
	SD_init();
	InitUART(9600, 8);
	
	while(1)
	{
        SD_readSingleBlock(Block_1, buffer);
		SendString("\nBlock ");
		SendLong(Block_1);
		SendString(" =\n");
		for (int i = 0; i<512; i++)
        {
	        SendInteger(buffer[i]);
			SendChar(' ');
        }
		
        SD_readSingleBlock(Block_2, buffer);
		SendString("\nBlock ");
		SendLong(Block_2);
		SendString(" =\n");
		for (int i = 0; i<512; i++)
		{
			SendInteger(buffer[i]);
			SendChar(' ');
		}
		char x = ReadChar();
		
		if (x == 'e')
		{
	        SD_erase (Block_1, Block_2-Block_1+1);			
		    SendString("\nSD Blocks from ");
		    SendLong(Block_1);
		    SendString(" to ");
		    SendLong(Block_2);
		    SendString("erased\n");									
		}
		
		if (x == '1')
		{
			for (int i = 0; i<512; i++)
			{
				buffer[i] = i;
			}
			SD_writeSingleBlock(Block_1, buffer);			
			SendString("\nBlock ");
			SendLong(Block_1);
			SendString(" programmed with 0,1,2,3,...\n");
		}
		
		if (x == '2')
		{
			for (int i = 0; i<512; i++)
			{
				buffer[i] = i;
			}
			SD_writeSingleBlock(Block_2, buffer);
			SendString("\nBlock ");
			SendLong(Block_2);
			SendString(" programmed with 0,1,2,3,...\n");
		}							
	}
}