/*
 * TouchDisplayDriver.h
 *
 * Created: 06-04-2022 10:29:25
 *  Author: Rasmus
 */ 


#ifndef TOUCHDISPLAYDRIVER_H_
#define TOUCHDISPLAYDRIVER_H_

void initTouchDisplay();
int* readInput();
void writeByte(unsigned char input);
unsigned char readByte();


#endif /* TOUCHDISPLAYDRIVER_H_ */