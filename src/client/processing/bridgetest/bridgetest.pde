import gab.opencv.*;
import processing.video.*;
import processing.sound.*;
import java.awt.Rectangle;
import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;



Movie video;
OpenCV opencv;
int multiplier = 5;
boolean debug = true;
ArrayList<Integer> toneLines;

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

  //delay(1000); // If this isn't present it'll say the video is null
}

void draw() {
  fill(255, 255, 255, 7);
  noStroke();
  rect(0,0,width,height);
  
  toneLines = drawToneLines();
  
  image(video, 0, 0);  
  opencv.loadImage(video);
  
  opencv.updateBackground();
  
  opencv.erode();
  opencv.dilate();
  opencv.dilate();
  opencv.dilate();
  opencv.dilate();

  //opencv.erode();
  
  ArrayList<Contour> contours = opencv.findContours();
  
  for (Contour contour : contours) {
    //Rectangle rect = contour.getBoundingBox();
    contour.setPolygonApproximationFactor(1);
    Contour convexHull = contour.getPolygonApproximation();
    Rectangle rect = convexHull.getBoundingBox();
    
    drawObject(rect, contour);
    playSound(contour);
  }
  
  sendTotalObjectsMessage(contours.size());
}

private void drawObject(Rectangle rect, Contour contour) {
  fill(255, 223, 0);
  stroke(255, 223, 0);
  
  if (rect.width > 10 && rect.height > 5 && rect.height < 50 && rect.width < 50) {
    //rect(rect.x * multiplier, rect.y * multiplier, 100, 60);
    ellipse(rect.x * multiplier, rect.y * multiplier, 50, 50);
    noFill();
    contour.draw();
    fill(255, 223, 0);
  }
}

private void playSound(Contour contour) {
  for (int i = 0; i < toneLines.size(); i++) {
    Rectangle rect = contour.getBoundingBox();
    double centerY = rect.getCenterY();
    double distance = Math.abs(centerY * multiplier - toneLines.get(i));
    if (distance < 5) {
      ellipse(rect.x * multiplier, rect.y * multiplier, 150, 150);
      // Super temp - will refactor - we'll only have one tonebar object per line - not a new one each loop. Poor garbage collector!
      ToneBar toneBar = new ToneBar(this, getTone(i));
      toneBar.play();
      //sine.play(, 0.2);
      //env.play(sine, 0.02, 0.04, 0.3, 0.4);
    }
  }
}

private int getTone(int i) {
 switch (i) {
  case 4:
    return 110;
  case 3:
    return 220;
  case 2: 
    return 440;
  case 1:
    return 880;
  case 0:
    return 1760;
  default:
    return 440;
 }
}

void movieEvent(Movie m) {
  m.read();
}

private void sendTotalObjectsMessage(int objectsCount) {
  OscMessage myMessage1 = new OscMessage("/objectcount");
  myMessage1.add(objectsCount); 
  oscP5.send(myMessage1, myRemoteLocation);
 
}

private ArrayList<Integer> drawToneLines() {
  ArrayList<Integer> result = new ArrayList<Integer>();
  int numLines = 4;
  int spaceHeight = height / numLines + 2;
  int line = spaceHeight;
  while(line < height) {
   result.add(line);
   line += spaceHeight;
  }
  result.add(line);
  
  if (debug) {
    stroke(0);
    for (int l : result) {
      line(0, l, width, l); 
      fill(200);
      rect(0, l, width, 10);
      fill(255);
    }
  }
  
  return result;
}

private class ToneBar {
  private int freq;
  private SinOsc sine;
  private Env env;
  private PApplet parent;
  
  ToneBar(PApplet parent, int freq) {
    this.parent = parent;
    this.freq = freq;
    this.sine = new SinOsc(this.parent);
    this.env = new Env(this.parent);
  }
  
  public void play() {
   this.sine.play(this.freq, 0.2);
   this.env.play(this.sine, 0.02, 0.04, 0.3, 0.4);
  }
}
