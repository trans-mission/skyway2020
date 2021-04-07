import gab.opencv.*;
import processing.video.*;
import java.awt.Rectangle;
import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

Movie video;
OpenCV opencv;
int multiplier = 5;

void setup() {
  size(1760, 1200);

  oscP5 = new OscP5(this, 12000);
  myRemoteLocation = new NetAddress("127.0.0.1", 12001);
  
  
  //video = new Movie(this, "dayTest0.mp4");
  video = new Movie(this, "nightTest0.mp4");
  opencv = new OpenCV(this, 352, 240);
  
  opencv.startBackgroundSubtraction(5, 3, 0.5);
  
  stroke(255, 128, 0);
  fill(255, 128, 0);
  
  video.loop();
  //video.play();
  delay(1000);
}

void draw() {
  background(255);
  image(video, 0, 0);  
  opencv.loadImage(video);
  
  opencv.updateBackground();
  
  opencv.dilate();
  //opencv.erode();

  //noFill();
  //stroke(255, 128, 0);
  strokeWeight(1);
  ArrayList<Contour> contours = opencv.findContours();
  for (Contour contour : contours) {
    Rectangle rect = contour.getBoundingBox();
    contour.draw();
    if (rect.width > 15 && rect.height > 5) {
      rect(rect.x * multiplier, rect.y * multiplier, rect.width * multiplier, rect.height * multiplier);
    }
    
    //rect(rect.x * multiplier, rect.y * multiplier, rect.width * multiplier, rect.height * multiplier);
  }
  
  OscMessage myMessage1 = new OscMessage("/objectcount");
  myMessage1.add(contours.size()); 
  oscP5.send(myMessage1, myRemoteLocation);
}

void movieEvent(Movie m) {
  m.read();
}
