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
  
  video = new Movie(this, "dayTest0.mp4");
  //video = new Movie(this, "nightTest0.mp4"); //<>//
  opencv = new OpenCV(this, 352, 240);
  
  opencv.startBackgroundSubtraction(5, 3, 0.5);
  
  stroke(255, 223, 0);
  strokeWeight(1);
  fill(255, 223, 0);
  
  video.loop();
  //video.play();
  delay(1000);
}

void draw() {
  fill(255, 255, 255, 7);
  rect(0,0,width,height);
  
  image(video, 0, 0);  
  opencv.loadImage(video);
  
  opencv.updateBackground();
  
  opencv.erode();
  opencv.dilate();
  opencv.dilate();
  //opencv.erode();
  
  ArrayList<Contour> contours = opencv.findContours();
  
  for (Contour contour : contours) {
    //Rectangle rect = contour.getBoundingBox();
    contour.setPolygonApproximationFactor(1);
    Contour convexHull = contour.getPolygonApproximation();
    Rectangle rect = convexHull.getBoundingBox();
    contour.draw();
    fill(255, 223, 0);
    if (rect.width > 10 && rect.height > 5 && rect.height < 50 && rect.width < 50) {
      //rect(rect.x * multiplier, rect.y * multiplier, 100, 60);
      ellipse(rect.x * multiplier, rect.y * multiplier, 50, 50);
      //noFill();
      //contour.draw();
    }
  }
  
  sendTotalObjectsMessage(contours.size());
}

void movieEvent(Movie m) {
  m.read();
}

private void sendTotalObjectsMessage(int objectsCount) {
  OscMessage myMessage1 = new OscMessage("/objectcount");
  myMessage1.add(objectsCount); 
  oscP5.send(myMessage1, myRemoteLocation);
 
}
