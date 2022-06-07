/*

MAX30205 connections:
Vin  - 5V (3.3V is allowed)
GND - GND
SDA - A4 (or SDA)
SCL - A5 (or SCL)

MQ135 connections:
Vin - 5V
GND - GND
A0 - A0

AD8232 connections:
3.3V - 3.3V
GND - GND
OUTPUT - A1
LO- - 11
LO+ - 10

*/

#include <Wire.h>
#include "Protocentral_MAX30205.h"
MAX30205 tempSensor;

void setup() {
  Serial.begin(9600);
  Wire.begin();

  // MAX30102
  //scan for temperature in every 30 sec untill a sensor is found. Scan for both addresses 0x48 and 0x49
  while(!tempSensor.scanAvailableSensors()){
    Serial.println("Couldn't find the temperature sensor, please connect the sensor." );
    delay(3000);
  }

  tempSensor.begin();   // set continuos mode, active mode

  // AD8232
  pinMode(10, INPUT);
  pinMode(11, OUTPUT);
}

int counter = 0; // 1 milisecond

void loop() {
  if (counter % 5000 == 0) // 5 second
  {
	float temp = tempSensor.getTemperature(); 
  Serial.print("temp,");
  Serial.println(temp ,2);

  }
  
  if (counter % 5000 == 0) // 5 second
  {
    int pollution = analogRead(A0);
    Serial.print("pollution,");
    Serial.println(pollution);
    
  } 

  if (counter % 10 == 0) // 10 milisecond
  {
    Serial.print("ecg,");
    if(digitalRead(10) == 1 || digitalRead(11) == 1) {
      Serial.println('!');
    }
    else {
      int ecg = analogRead(A1);
      Serial.println(ecg);
    }  
  }
  
  counter += 10;
	delay(10);
}
