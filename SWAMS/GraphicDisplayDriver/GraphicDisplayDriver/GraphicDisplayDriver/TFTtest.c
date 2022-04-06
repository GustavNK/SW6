/*
 * TFTtest.c
 * Test program for the TFTdriver
 *
 * Created: 15-02-2018 
 * Author : Henning Hargaard
 */ 

#include <avr/io.h>
#define F_CPU 16000000
#include <util/delay.h>
#include "TFTdriver.h"

//Interupt INT4

int main(void)
{
  // Initialize the display
  DisplayInit();
  // All pixels white (background)
  FillRectangle(0,0,320,240,31,63,31);
  // Draw red parts of danish flag
  //FillRectangle(0,140,100,100,31,0,0);
  //FillRectangle(0,0,100,100,31,0,0);
  //FillRectangle(140,0,320-140,100,31,0,0);
  //FillRectangle(140,140,320-140,100,31,0,0);  
  
  //1+2=position,3+4=size,5+6+7=rgb 
  FillRectangle(140,60,10,10,0,31,250);
      
  while(1)
  {		
	  //Test of touchscreen and draw
	  //Touchscreen(read) interrupt is touching
	  //Få touchscreen position
	  //Draw hvis farven er hvid i baggrund
  } 
}
