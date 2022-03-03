/******************************************************
FreeRTOS demo program.
Implementing 2 tasks, each blinking a LED.

Target = "Arduino Mega2560" + "PR I/O Shield"

Henning Hargaard 25.2.2018
*******************************************************/
#define F_CPU 16000000
#include <avr/io.h>
#include "FreeRTOS.h"
#include "task.h"
#include "led.h"
#include "semphr.h"
#include "queue.h"
#include <util/delay.h>

xSemaphoreHandle xSemaphore1 = NULL;
unsigned char count = 0;
xQueueHandle xQueue1 = NULL;

void decrementTask1(void *pvParameters)
{
	portTickType xLastWakeTime;
	xLastWakeTime=xTaskGetTickCount();
	while(1)
	{
		
		if(switchOn(0) && xSemaphoreTake(xSemaphore1,10)){
			count--;
			xQueueSend(xQueue1, &count,10);
			xSemaphoreGive(xSemaphore1);
		}
		vTaskDelayUntil(&xLastWakeTime,500);
	}
}

void incrementTask1(void *pvParameters)
{
	portTickType xLastWakeTime;
	xLastWakeTime=xTaskGetTickCount();
	while(1)
	{
		if(switchOn(1) && xSemaphoreTake(xSemaphore1,10)){
			count++;
			xQueueSend(xQueue1, &count,10);
			xSemaphoreGive(xSemaphore1);
		}
		vTaskDelayUntil(&xLastWakeTime,500);
	}
}

void recieveTask1(void *pvParameters){
		portTickType xLastWakeTime;
		xLastWakeTime=xTaskGetTickCount();
		unsigned char buffer;
		while(1)
		{
			xQueueReceive(xQueue1,&buffer,10);
			PORTB = buffer; // toggleLED(buffer);
			vTaskDelayUntil(&xLastWakeTime,500);
		}
}

ISR(INT0_vect){
	count = 0;
	xQueueSend(xQueue1,&count,10);
}

int main(void)
{
  initSwitchPort();
  initLEDport();	
  InitUART(115200,8);
  
  vSemaphoreCreateBinary(xSemaphore1);
  xQueue1 = xQueueCreate(1, sizeof(unsigned char));
  
  xTaskCreate( decrementTask1, ( signed char * ) "decrement", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );
  xTaskCreate( incrementTask1, ( signed char * ) "ïncrement", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );
  xTaskCreate( recieveTask1, ( signed char * ) "increment", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );
  
  vTaskStartScheduler();

  while(1)
  {}
}

