/*
 * SPIDriver.c
 *
 * Created: 06-04-2022 12:41:04
 *  Author: Rasmus
 */ 

static unsigned char SPIWRITE = 0;
static unsigned char SPIREAD = 0;
static unsigned char SPIDATAREADPIN = 0;
static unsigned char SPIDATAWRITEPIN = 0;
static unsigned char SPICLOCKPIN = 0;


void initSPI(unsigned char readPin, unsigned char writePin, unsigned char clockPin){
	SPIREADPIN = pin;
}

void setSPIData(unsigned char input){
	SPIWRITE = input;
}

unsigned char readSPIData(){
	return SPIREAD;
}

void transferBit(){
	tp = 1 & SPIWRITE;
	SPIWRITE = SPIWRITE << 1;
	hit clock
	SPIREAD = SPIDATAREADPIN | (SPIREAD << 1);
}

void transferByte(){
	
}
