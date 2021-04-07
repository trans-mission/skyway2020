import gab.opencv.*;
import processing.video.*;
import java.awt.Rectangle;

Movie video;
OpenCV opencv;
int multiplier = 5;

void setup() {
  size(1760, 1200);
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
  
  //opencv.dilate();
  //opencv.erode();

  //noFill();
  //stroke(255, 128, 0);
  strokeWeight(3);
  for (Contour contour : opencv.findContours()) {
    Rectangle rect = contour.getBoundingBox();
    //println("rect" + rect);
    //contour.draw();
    if (rect.width > 10 && rect.height > 5) {
      rect(rect.x * multiplier, rect.y * multiplier, rect.width * multiplier, rect.height * multiplier);
    }
  }
}

void movieEvent(Movie m) {
  m.read();
}
