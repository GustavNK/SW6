/*
 * UART.h
 *
 * Created: 20/04/2022 14.03.14
 *  Author: Simon Phi Dang
 */ 


#ifndef UART_H_
#define UART_H_

void initUART();
void sendChar(char c);
void sendString (char* Streng);

#endif /* UART_H_ */