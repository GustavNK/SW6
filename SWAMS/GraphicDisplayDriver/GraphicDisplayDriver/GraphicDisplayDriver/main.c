/*
 * GraphicDisplayDriver.c
 *
 * Created: 16/02/2022 12.10.53
 * Author : Simon Phi Dang
 */ 

#include <avr/io.h>
#include "TFTdriver.h"

int main(void)
{
	DisplayInit();
	DisplayOn();
	
	DisplayOff();
    /* Replace with your application code */
    while (1) 
    {
    }
}

