/*-------------------------------------------------------------------
  File name: "lcd162.c"

  Driver for "LCD Keypad Shield" alphanumeric display.
  Display controller = HD44780U (LCD-II).
  
  Max. uC clock frequency = 16 MHz (Tclk = 62,5 ns)

  Connection : PORTx (4 bit mode) :
  [LCD]        [Portx]
  RS   ------  PH 5
  RW   ------  GND
  E    ------  PH 6
  DB4  ------  PG 5
  DB5  ------  PE 3
  DB6  ------  PH 3
  DB7  ------  PH 4

  Henning Hargaard, February 5, 2018
---------------------------------------------------------------------*/
#include <avr/io.h>
#define F_CPU 16000000
#include <util/delay.h>
// Enabling us to use macro _NOP() to insert the NOP instruction
#include <avr/cpufunc.h>
#include "lcd162.h"
// library function itoa() is needed
#include <stdlib.h>
//*********************** PRIVATE (static) operations *********************
static void waitBusy()
{
	_delay_ms(20);
}  

static void pulse_E()
{
	// 1 NOP = 
	PORTH |= 1<<6;
	_NOP(); // PW_EH (Pulse width enable hold)
	_NOP();
	_NOP();
	_NOP();
	PORTH &= ~(1<<6);
	_NOP(); // Add one NOP for t_H  (Hold time)
  // To be implemented 
}

// Sets the display data pins according to the 4 lower bits of data
static void set4DataPins(unsigned char data)
{
  PORTH = (PORTH & 0b11100111) | ((data<<1) & 0b00011000);
  PORTE = (PORTE & 0b11110111) | ((data<<2) & 0b00001000);
  PORTG = (PORTG & 0b11011111) | ((data<<5) & 0b00100000);  
}

static void sendInstruction(unsigned char data)
{     
	PORTH &= ~(1<<5);  // RS skift til 0 for IR (instruction register)
	
	set4DataPins(data>>4);
	pulse_E();
	set4DataPins(data);
	pulse_E();
	
	waitBusy();
}

static void sendData(unsigned char data)
{      
  	PORTH |= (1<<5);  // RS skift til 1 for write to Data register
  	
  	set4DataPins(data>>4);
  	pulse_E();
  	set4DataPins(data);
  	pulse_E();
  	
  	waitBusy();
}

//*********************** PUBLIC functions *****************************

// Initializes the display, blanks it and sets "current display position"
// at the upper line, leftmost character (cursor invisible)
// Reference: Page 46 in the HD44780 data sheet
void LCDInit()
{
  // Initializing the used 
  DDRH |= 0b01111000;  // Outputs
  DDRE |= 0b00001000;  // 3 
  DDRG |= 0b00100000;  // 5
  
  // Wait 50 ms (min. 15 ms demanded according to the data sheet)
  _delay_ms(50);
  // Function set (still 8 bit interface)
  PORTG |= 0b00100000; // bit 5
  PORTE |= 0b00001000; // bit 3
  pulse_E();
  
  // Wait 10 ms (min. 4,1 ms demanded according to the data sheet)
  _delay_ms(10);
  // Function set (still 8 bit interface)
  pulse_E();

  // Wait 10 ms (min. 100 us demanded according to the data sheet)
  _delay_ms(10);
  // Function set (still 8 bit interface)
  pulse_E();

  // Wait 10 ms (min. 100 us demanded according to the data sheet)
  _delay_ms(10);
  // Function set (now selecting 4 bit interface !)
  PORTG &= 0b11011111;
  pulse_E();

  // Function Set : 4 bit interface, 2 line display, 5x8 dots
  sendInstruction( 0b00101000 );
  // Display, cursor and blinking OFF
  sendInstruction( 0b00001000 );
  // Clear display and set DDRAM adr = 0	
  sendInstruction( 0b00000001 );
  // By display writes : Increment cursor / no shift
  sendInstruction( 0b00000110 );
  // Display ON, cursor and blinking ON
  sendInstruction( 0b00001101 );
}

// Blanks the display and sets "current display position" to
// the upper line, leftmost character
void LCDClear()
{
  sendInstruction(0b00000001);
  _delay_ms(1.6); //Execution time for clear display
}

// Sets DDRAM address to character position x and line number y
void LCDGotoXY( unsigned char x, unsigned char y )
{
	
  sendInstruction(0b10000000 | (x&0x0F) | ((y%2)<<6)); //DB7 sets to 1
}

// Display "ch" at "current display position"
void LCDDispChar(char ch)
{
  sendData(ch);
}

// Displays the string "str" starting at "current display position"
void LCDDispString(char* str)
{
  while(*str != '\0')
  {
	  LCDDispChar(*str);
	  str++;
  }
}

// Displays the value of integer "i" at "current display position"
/************************************************************************/
/* Int16 = 32767                                                      */
/************************************************************************/
void LCDDispInteger(int i)
{
	char buf[256]; 
	itoa(i, buf, 10);
	LCDDispString(buf);
}

// Loads one of the 8 user definable characters (UDC) with a dot-pattern,
// pre-defined in an 8 byte array in FLASH memory
void LCDLoadUDC(unsigned char UDCNo, const unsigned char *UDCTab)
{
	for (char i = 0; i < 8; i++)
	{
		sendInstruction(0b01000000 |(UDCNo%9 << 3) | i);
		sendData(*(UDCTab + i));
	}
	
}

// Selects, if the cursor has to be visible, and if the character at
// the cursor position has to blink.
// "cursor" not 0 => visible cursor.
// "blink" not 0 => the character at the cursor position blinks.
void LCDOnOffControl(unsigned char cursor, unsigned char blink)
{
  // To be implemented
}

// Moves the cursor to the left
void LCDCursorLeft()
{
  // To be implemented
}

// Moves the cursor to the right
void LCDCursorRight()
{
  // To be implemented
}

// Moves the display text one position to the left
void LCDShiftLeft()
{
  // To be implemented
}

// Moves the display text one position to the right
void LCDShiftRight()
{
  // To be implemented
}

// Sets the backlight intensity to "percent" (0-100)
void setBacklight(unsigned char percent)
{
	//OC2A PWM
	DDRB |= 1<<4;
	PORTB |= 1<<4;
  // To be implemented
}

// Reads the status for the 5 on board keys
// Returns 0, if no key pressed
unsigned char readKeys()
{
  // To be implemented
  return 'a';
}
