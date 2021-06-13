import processing.serial.*;

Serial arduinoPort;

byte byteArr[];
final int LEFT = 0;
final int RIGHT = 1;

void setup() {
  
  // List all the available serial ports:
  printArray(Serial.list());

  // Open the port you are using at the rate you want:
  arduinoPort = new Serial(this, Serial.list()[0], 9600);
  byteArr = new byte[2];
}

void draw() {
  
  verify();
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

void mouseClicked() {
  
 // dummy lane counts for example
 int l = (int) random(255);
 int r = (int) random(255);
 
 sendBytes(l, r);
}
