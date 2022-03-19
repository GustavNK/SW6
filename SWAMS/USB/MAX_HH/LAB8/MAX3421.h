/*
 * MAX3421.h
 *
 * Created: 15-02-2021
 *  Author: Henning Hargaard
 */ 
extern unsigned char Suspended;
extern unsigned int msec_timer;
extern unsigned char inhibit_send;  
extern unsigned int blinktimer;

void initMAX3421();
void check_for_resume();
unsigned char MAX_Int_Pending();
void service_irqs();
unsigned char rreg(unsigned char reg);