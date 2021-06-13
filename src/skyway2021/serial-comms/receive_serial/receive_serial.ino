const int BUFFER_SIZE = 50;
byte buf[BUFFER_SIZE];

void setup() {
  // initialize serial:
  Serial.begin(9600);
}

void loop() {

}

void serialEvent() {

  if (Serial.available()>=2) { // 2 bytes available?

    Serial.readBytes(buf, 2);
    
    Serial.flush();
    Serial.print(buf[0]);
    Serial.print(' ');
    Serial.print(buf[1]);
  }
}
