/*
Pressure Sensor test Code
*/

// These constants won't change.  They're used to give names
// to the pins used:
const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to

int sensorValue = 0;        // value read from the pressure sensor via the amplifier stage
float outputValue = 0;        // value output to the Serial port and LCD display

void setup() 
{
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
}

void loop() 
{
  // read the analog in value:
  sensorValue = analogRead(analogInPin);            
  Serial.print(sensorValue);    
  Serial.print("\tA1 = " );                       
  Serial.print( analogRead(A1));  
  Serial.print("\tA2 = " );                       
  Serial.println( analogRead(A2));  
  // outputValue = map(sensorValue, 10, 1023, 0, 100); //The zero value of sensor is around 10
  
  // print the results to the serial monitor:
  //Serial.print("sensor = " );                       
  //Serial.print(sensorValue);      
  //Serial.print("\toutput = ");      
  //Serial.println(outputValue);   

  // wait 500 milliseconds before the next loop
  // for the analog-to-digital converter to settle
  // after the last reading:
  delay(100);                     
}
