#include <avr/io.h>
#include "SD_Driver.h"
#include "SPI_Driver.h"

//******************************************************************
//Function	: To initialize the SD/SDHC card in SPI mode
//Arguments	: None
//return	: unsigned char; will be 0 if no error,
// 			  otherwise the response byte will be sent
//******************************************************************
unsigned char SD_init()
{
	unsigned char i, response, SD_version;
	unsigned int retry = 0;	
	
	SPI_init();
		
	for(i = 0; i < 10; i++)
	{
		SPI_transmit(0xff); //80 clock pulses before sending the first command (Only needs 76, but we just do 80 to be sure)
	}
	
	SPI_Chip_Select();
	do
	{
		response = SD_sendCommand(GO_IDLE_STATE, 0); //send 'reset & go idle' command (= CMD0)
		retry++;
		if(retry > 0x20)
			return 1; //time out, card not detected
	} while(response != 0x01); //repeat until SD is in IDLE state

	SPI_Chip_Deselect();
	SPI_transmit (0xff);
	SPI_transmit (0xff);

	retry = 0;
	
	SD_version = 2; //default set to SD compliance with ver2.x;
					//this may change after checking the next command
	do
	{
		response = SD_sendCommand(SEND_IF_COND, 0x000001AA); //Check power supply status, mandatory for SDHC card (= CMD8)
		retry++;
		if(retry > 0xfe)
		{
			SD_version = 1;
			cardType = 1;
			break;
		} //time out
	} while(response != 0x01);
	
	retry = 0;
	do
	{
		response = SD_sendCommand(APP_CMD, 0); //CMD55, must be sent before sending any ACMD command
		response = SD_sendCommand(SD_SEND_OP_COND, 0x40000000); //ACMD41

		retry++;
		if(retry > 0xfe)
			return 2;  //time out, card initialization failed
	} while(response != 0x00);
	
	retry = 0;
	SDHC_flag = 0;
	
	if (SD_version == 2)
	{
		do
		{
			response = SD_sendCommand(READ_OCR, 0); // (=CMD58)
			retry++;
			if(retry > 0xfe)
			{
				cardType = 0;
				break;
			} //time out
		} while(response != 0x00);
		
		if(SDHC_flag == 1)
			cardType = 2;
		else
			cardType = 3;
	}

	SD_sendCommand(CRC_ON_OFF, OFF); //disable CRC; default - CRC disabled in SPI mode
	SD_sendCommand(SET_BLOCK_LEN, 512); //set block size to 512; default size is 512
	
	return 0; //successful return
}

//******************************************************************
//Function	: To send a command to SD card
//Arguments	: unsigned char (8-bit command value)
// 			  & unsigned long (32-bit command argument)
//return	: unsigned char; response byte
//******************************************************************
unsigned char SD_sendCommand(unsigned char cmd, unsigned long arg)
{
	unsigned char response, retry = 0, status;

	//SD card accepts byte address while SDHC accepts block address in multiples of 512
	//so, if it's SD card we need to convert block address into corresponding byte address by 
	//multiplying it with 512. which is equivalent to shifting it left 9 times.
	//The following 'if' statement does that
	if(SDHC_flag == 0)
	{
		if(cmd == READ_SINGLE_BLOCK      ||
		   cmd == READ_MULTIPLE_BLOCKS   ||
		   cmd == WRITE_SINGLE_BLOCK     ||
		   cmd == WRITE_MULTIPLE_BLOCKS  ||
		   cmd == ERASE_BLOCK_START_ADDR ||
		   cmd == ERASE_BLOCK_END_ADDR)
		   {
			   arg = arg << 9;
		   }
    }

	SPI_Chip_Select();
	SPI_transmit(cmd | 0b01000000); //send command, the first two bits are always '01'
	SPI_transmit(arg >> 24);
	SPI_transmit(arg >> 16);
	SPI_transmit(arg >> 8);
	SPI_transmit(arg);

	if(cmd == SEND_IF_COND)	//it is compulsory to send correct CRC for CMD8 (CRC=0x87) & CMD0 (CRC=0x95)
		SPI_transmit(0x87); //for remaining commands, CRC is ignored in SPI mode
	else 
		SPI_transmit(0x95); 

	while((response = SPI_receive()) == 0xff) //wait for response
	{
		if(retry++ > 254)
			break; //time out error
	}

	if(response == 0x00 && cmd == READ_OCR) //checking response of CMD58
	{
		status = SPI_receive() & 0x40; //first byte of the OCR register (bit 31:24)
		if(status == 0x40)
			SDHC_flag = 1; //we need it to verify SDHC card
		else
			SDHC_flag = 0;

		SPI_receive(); //remaining 3 bytes of the OCR register are ignored here
		SPI_receive(); //one can use these bytes to check power supply limits of SD
		SPI_receive(); 
	}

    // This is added by Henning Hargaard 6/3 2020 (Response = 1b => busy while reading 0)
	if (cmd == ERASE_SELECTED_BLOCKS)
	{
		while (SPI_receive() == 0)
		{}
	}
    
	SPI_receive(); //extra 8 CLK
	SPI_Chip_Deselect();
	return response; //return state
}

//*****************************************************************
//Function	: To erase specified no. of blocks of SD card
//Arguments	: None
//return	: unsigned char; will be 0 if no error,
// 			  otherwise the response byte will be sent
//*****************************************************************
unsigned char SD_erase (unsigned long startBlock, unsigned long numberOfBlocks)
{
	unsigned char response;
	//Data Address
	response = SD_sendCommand(ERASE_BLOCK_START_ADDR, startBlock);
	if(response > 0x0) {return response;}
	response = SD_sendCommand(ERASE_BLOCK_END_ADDR, startBlock+numberOfBlocks);
	if(response > 0x0) {return response;}
	response = SD_sendCommand(ERASE_SELECTED_BLOCKS,0);
	if(response > 0x0) {return response;}
	
	return 0;
  // To be implemented
}

//******************************************************************
//Function	: To read a single block from SD card
//Arguments	: None
//return	: unsigned char; will be 0 if no error,
// 			  otherwise the response byte will be sent
//******************************************************************
unsigned char SD_readSingleBlock(unsigned long startBlock, unsigned char* ptr)
{
	unsigned char response;
	response = SD_sendCommand(READ_SINGLE_BLOCK,startBlock);
	//Forventer response giver block token tilbage n�r den kommer kan vi afl�se spi
	//Block
	while(response != 0b11111110){
		response = SD_sendCommand(READ_SINGLE_BLOCK,startBlock);
	}
		
	//Read 512 bytes
	for(int i = 0; i < 512; i++){
		*ptr = SPI_receive();
		ptr++;
	}
	//Read CRC Dummy
	unsigned char dummy = SPI_receive();
	return 0;
}

//******************************************************************
//Function	: To write to a single block of SD card
//Arguments	: None
//return	: unsigned char; will be 0 if no error,
// 			  otherwise the response byte will be sent
//******************************************************************
unsigned char SD_writeSingleBlock(unsigned long startBlock, unsigned char* ptr)
{
	unsigned char response;
	//Send Write single block
	response = SD_sendCommand(WRITE_SINGLE_BLOCK,startBlock);
	if(response > 0x0) {return response;}	
	//Send 0b11111110 BLOCK TOKEN
	//Select chip
	SPI_Chip_Select();
	SPI_transmit(0b11111110);
	
	//Send 512 bytes
	for(int i = 0; i < 512; i++){
		SPI_transmit(*ptr);
		ptr++;
	}
	//Send dummy crc
	SPI_transmit(0xff);
	// Afvent IDLE Response
	while (SPI_receive() == 0)
	{}
	SPI_Chip_Deselect();
	return 0;
}