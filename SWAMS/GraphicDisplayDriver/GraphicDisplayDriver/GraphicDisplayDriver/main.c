/*
 * GraphicDisplayDriver.c
 *
 * Created: 16/02/2022 12.10.53
 * Author : Simon Phi Dang
 */ 
#define F_CPU 16000000
#include <avr/io.h>
#include <util/delay.h>
#include "TFTdriver.h"

int main(void)
{

	DisplayInit();
	DisplayOn();
	_delay_ms(2000);
	DisplayOff();
	_delay_ms(2000);
	DisplayOn();
	_delay_ms(2000);
	DisplayOff();
	_delay_ms(2000);
	DisplayOn();
    /* Replace with your application code */
    while (1) 
    {
    }
}

