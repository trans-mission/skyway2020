
const int BUFFER_SIZE = 50;
byte buf[BUFFER_SIZE];

void setup() {
  // initialize serial:
  Serial.begin(9600);
}

void loop() {

 
}

/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {

  if (Serial.available()>=2) { // 2 bytes available?

    Serial.readBytes(buf, 2);
    
    Serial.flush();
    Serial.print(buf[0]);
    Serial.print(' ');
    Serial.print(buf[1]);
  }
}
