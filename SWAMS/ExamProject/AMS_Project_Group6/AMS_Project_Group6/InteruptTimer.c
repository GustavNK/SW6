/*
 * InteruptTimer.c
 *
 * Created: 11/05/2022 13.36.48
 *  Author: Simon Phi Dang
 */ 
#include <avr/interrupt.h>
#include "InteruptTimer.h"
// Global variabel, der tæller antal Timer0 overflows (bemærk: SKAL erklæres volatile)
volatile unsigned int antal_overflows = 0;
volatile unsigned int busy_flag = 0;
// Interrupt service rutine for Timer0 overflow
ISR(TIMER0_OVF_vect)
{
	// LED6 toggles, når der har vaeret 62500 interrupts
	// = hvert sekund, da 16000000/1024/256 = 60Hz
	antal_overflows++;
	if (antal_overflows >= 60)
	{
		antal_overflows = 0;
		busy_flag = 0;
		TCCR0B = 0;
	}
}


void initTimer0()
{
	// Timer0: Normal mode, PS = 1024
	TCCR0A = 0b00000000;
	TCCR0B = 0b00000101;
	// Enable Timer0 overflow interrupt
	TIMSK0 |= 0b00000001;
}

void setBusy(){
	busy_flag = 1;
	TCCR0B = 5; // Clock select 0b101 /1024 prescale
}

unsigned char busy()
{
	if(busy_flag == 0){
		return 1;
	}
	return 0;
}