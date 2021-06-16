import processing.serial.*;
import controlP5.*;

Serial arduinoPort;
ControlP5 cp5;

final int PORT_INDEX = 1;
final int MIN_VAL = 0;
final int MAX_VAL = 20;

byte byteArr[];
final int LEFT = 0;
final int RIGHT = 1;

int leftServoPos = 0;
int rightServoPos = 0;

void setup() {
  
  size(200, 100);
  
  // List all the available serial ports:
  printArray(Serial.list());

  // Open the port you are using at the rate you want:
  arduinoPort = new Serial(this, Serial.list()[PORT_INDEX], 9600);
  byteArr = new byte[2];
  
  cp5 = new ControlP5(this);
  
  // name, minValue, maxValue, defaultValue, x, y, width, height
  cp5.addSlider("leftServoSlider", MIN_VAL, MAX_VAL, 0, 10, 10, 100, 20);
  
  // name, minValue, maxValue, defaultValue, x, y, width, height
  cp5.addSlider("rightServoSlider", MIN_VAL, MAX_VAL, 0, 10, 50, 100, 20);
 
}

void draw() {
  sendBytes(leftServoPos, rightServoPos);
  verify();
}

void leftServoSlider(int theValue) {
  leftServoPos = theValue;
}

void rightServoSlider(int theValue) {
  rightServoPos = theValue;
}


void sendBytes(int left, int right) {
  
  Integer l = new Integer(left);
  Integer r = new Integer(right);
  
  byteArr[LEFT]  = l.byteValue();
  byteArr[RIGHT] = r.byteValue();
 
  arduinoPort.write(byteArr);
}

// debug function
// feedback from arduino to verify bytes received
void verify() {
   byte[] inBuffer = new byte[1];
  while (arduinoPort.available() > 0) {
    inBuffer = arduinoPort.readBytes();
    arduinoPort.readBytes(inBuffer);
    if (inBuffer != null) {
      String myString = new String(inBuffer);
      println(myString);
    }
  }
}
