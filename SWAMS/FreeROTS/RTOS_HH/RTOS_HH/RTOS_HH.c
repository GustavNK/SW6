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
#include <util/delay.h>

xSemaphoreHandle xSemaphore1 = NULL;

void vLEDFlashTask1( void *pvParameters )
{
portTickType xLastWakeTime;
xLastWakeTime=xTaskGetTickCount();
  while(1)
  {
    toggleLED(0);
    vTaskDelayUntil(&xLastWakeTime,1000);
  }
}

void vLEDFlashTask2( void *pvParameters )
{
portTickType xLastWakeTime;
xLastWakeTime=xTaskGetTickCount();
  while(1)
  {
    toggleLED(1);
    vTaskDelayUntil(&xLastWakeTime,500);
  }
}


void vSWTask1(void *pvParameters)
{
	portTickType xLastWakeTime;
	xLastWakeTime=xTaskGetTickCount();
	while(1)
	{
		xSemaphoreTake(xSemaphore1,10);

		if(switchOn(0)){
			xSemaphoreGive(xSemaphore1);
		}
		vTaskDelayUntil(&xLastWakeTime,500);
	}
}

void vLEDFlashTask3(void *pvParameters)
{
	portTickType xLastWakeTime;
	xLastWakeTime=xTaskGetTickCount();
	while(1)
	{
		if(xSemaphoreTake(xSemaphore1,1)){
			toggleLED(7);
			_delay_ms(200);
			toggleLED(7);
			xSemaphoreGive(xSemaphore1);
		}
		vTaskDelayUntil(&xLastWakeTime,500);
	}
}


int main(void)
{
  vSemaphoreCreateBinary(xSemaphore1);
  initSwitchPort();  
  initLEDport();
  if(xSemaphore1 == NULL) toggleLED(6);

  xTaskCreate( vLEDFlashTask1, ( signed char * ) "LED1", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );
  xTaskCreate( vLEDFlashTask2, ( signed char * ) "LED2", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );	
  xTaskCreate( vSWTask1, ( signed char * ) "SW1", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL);
  xTaskCreate( vLEDFlashTask3, ( signed char * ) "LED3", configMINIMAL_STACK_SIZE, NULL, tskIDLE_PRIORITY, NULL );	
  vTaskStartScheduler();
  while(1)
  {}
}

