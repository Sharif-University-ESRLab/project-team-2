//////////////////////////////////////////////////////////////////////////////////////////
//
//    Arduino example for the MAX30205 body temperature sensor breakout board
//
//    Author: Ashwin Whitchurch
//    Copyright (c) 2020 ProtoCentral
//
//    This software is licensed under the MIT License(http://opensource.org/licenses/MIT).
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
//   NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//   WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//   SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//   For information on how to use, visit https://github.com/protocentral/ProtoCentral_MAX30205
/////////////////////////////////////////////////////////////////////////////////////////

/*

This program Print temperature on terminal

Hardware Connections (Breakoutboard to Arduino):
Vin  - 5V (3.3V is allowed)
GND - GND
SDA - A4 (or SDA)
SCL - A5 (or SCL)

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
  pinMode(11, OUTPUT;
}

void loop() {
	float temp = tempSensor.getTemperature(); // read temperature for every 100ms
  Serial.print("temp,")
  Serial.println(temp ,2);

  int pollution = analogRead(A0);
  Serial.print("pollution,")
  Serial.println(sensorValue);
	
  Serial.print("ecg,")
  if(digitalRead(10) == 1 || digitalRead(11) == 1) {
    Serial.println('!');
  }
  else {
    Serial.println(analogRead(A1));
  }

	delay(100);
}
