#include <Servo.h>

const int SMOOTHING = 50;
const byte MIN_VAL = 0;
const byte MAX_VAL = 20;
const int BUFFER_SIZE = 50;
byte buf[BUFFER_SIZE];

Servo leftServo;
Servo rightServo;

int leftPos = 0;
int rightPos = 180;

int l_rollBin[SMOOTHING];
int l_rollFinal = 0;

int r_rollBin[SMOOTHING];
int r_rollFinal = 0;
int roll_inc = 0;

void setup() {
  
  Serial.begin(9600);
   
  leftServo.attach(9); 
  rightServo.attach(10);

  leftServo.write(leftPos);
  rightServo.write(rightPos);

  memset(l_rollBin, 0, sizeof(l_rollBin));
  memset(r_rollBin, 0, sizeof(r_rollBin));

  delay(5000);
}

void loop() {

  updateServos();
}

void updateServos() {
  leftServo.write(leftPos);
  rightServo.write(rightPos);
}

void serialEvent() {

  if (Serial.available()>=2) { // 2 bytes available?

    Serial.readBytes(buf, 2);

    l_rollBin[roll_inc] = map(buf[0], 0, 255, 0, 180);
    r_rollBin[roll_inc] = map(buf[1], 0, 255, 180, 0); //reversed

    //increment
    roll_inc++;
    roll_inc = roll_inc % SMOOTHING;

    calcAvgPositions();
    
    Serial.flush();
    Serial.print(leftPos);
    Serial.print(' ');
    Serial.print(rightPos);
  }
}

int calcAvgPositions() {
  
  // get sum of arr vals
  int l_arrSum = sumArray(l_rollBin);
  int r_arrSum = sumArray(r_rollBin);
  
  leftPos = l_arrSum / SMOOTHING;
  rightPos = r_arrSum / SMOOTHING;
}

int sumArray(int arr[SMOOTHING]) {
  int arrSum = 0;
  
  // sum all values
  for (int i = 0; i < SMOOTHING; i++) {
    arrSum += arr[i];
  } 
  return arrSum;
}
