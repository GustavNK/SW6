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
unsigned char getX();
unsigned int getY();
unsigned int getZ();
struct Position
{
	unsigned int x;
	unsigned int y;
	unsigned int z;
};
unsigned int formatX(unsigned int x);
unsigned int formatY(unsigned int y);
struct Position getPosition();
#endif /* TOUCHDISPLAYDRIVER_H_ */