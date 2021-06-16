import processing.serial.*;

Serial arduinoPort;

final boolean USE_NOISE = true;
final int SERIAL_PORT_INDEX = 11;

byte byteArr[];
final int LEFT = 0;
final int RIGHT = 1;

//for generating dummy values
float time = 0.0;
float increment = 0.1;

void setup() {
  
  // List all the available serial ports:
  printArray(Serial.list());

  // Open the port you are using at the rate you want:
  arduinoPort = new Serial(this, Serial.list()[SERIAL_PORT_INDEX], 9600);
  byteArr = new byte[2];
 
}

void draw() {
  generateDummyValues();
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

// for testing purposes
// normally values will come from the app
// for left and right-bound traffic counts
void generateDummyValues() {
  
  int l, r;
  
  if(USE_NOISE) {
   // dummy lane counts for example
   l = int(noise(time) * random(255));
   r = int(noise(time) * random(255));
  } else { // random
    // dummy lane counts for example
   l = int(random(255));
   r = int(random(255));
  }
 
 
 //int r = (int) noise(time) * (int) random(255);
 
  // With each cycle, increment the " time "
  time += increment;
 
  //println(l);
  sendBytes(l, r);
  
}
