/*
 * TouchScreenDriver.h
 *
 * Created: 06/04/2022 13.03.16
 *  Author: Simon Phi Dang
 */ 


#ifndef TOUCHSCREENDRIVER_H_
#define TOUCHSCREENDRIVER_H_

void TouchScreenInit();
unsigned long TouchScreenRead(unsigned char* x, unsigned char* y);




#endif /* TOUCHSCREENDRIVER_H_ */