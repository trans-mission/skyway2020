import gab.opencv.*;
import processing.video.*;
//import processing.sound.*;
import java.awt.Rectangle;
import oscP5.*;
import netP5.*;
import java.util.*;

// Config
int multiplier = 5;
int videoLengthInSeconds = 90;

// Init
OscP5 oscP5;
NetAddress abletonReceiver;
Movie video;
OpenCV opencv;
boolean debug = false;
ArrayList<ToneBar> toneBars;
int lastVidLoad;

void setup() {
  size(1760, 1200);

  oscP5 = new OscP5(this, 12000);
  abletonReceiver = new NetAddress("127.0.0.1", 12001);

  toneBars = createToneBars();
  
  setLatestVideo();
 
  opencv = new OpenCV(this, 352, 240);
  opencv.startBackgroundSubtraction(5, 3, 0.5);
  
  stroke(255, 223, 0);
  strokeWeight(1);
  fill(255, 223, 0);
  
  if (video == null) {
    println("No video found. Exiting");
    return;
  }

  video.loop();

}

void draw() {
  
  checkForNewVideo();
  drawToneBars(toneBars);
  clearCanvas();
  getFrameFromVideo();
  processFrame(opencv);
  int objectCount = makeArtHappen();
  sendTotalObjectsMessage(objectCount);
}

void checkForNewVideo() {
  if(lastVidLoad + videoLengthInSeconds * 1000 < millis()) {
    thread("setLatestVideo");
    lastVidLoad = millis();
  }
}

void clearCanvas() {
  fill(255, 255, 255, 7);
  noStroke();
  rect(0,0,width,height);
}

void getFrameFromVideo() {
  image(video, 0, 0);  
  opencv.loadImage(video);
  opencv.updateBackground();
}

int makeArtHappen() {
  ArrayList<Contour> contours = opencv.findContours();
  
  for (Contour contour : contours) {
    contour.setPolygonApproximationFactor(1);
    Contour convexHull = contour.getPolygonApproximation();
    Rectangle rect = convexHull.getBoundingBox();
    drawObject(rect, contour);
    playSound(contour);
  }

  return contours.size();
}

Movie getLatestVideo() {
  Movie result;
  String latestVideoFileName = getLatestVideoFileName();
  if (latestVideoFileName == "") return null;
  result = new Movie(this, latestVideoFileName);
  
  return result;
}

void setLatestVideo() {
  println("Setting latest vid at: " + millis());
  Movie video = getLatestVideo();
  if (video == null) return;
  initializeVideo(video);

  Movie oldVideo = this.video;
  this.video = video;
  
  if (oldVideo != null) {
    println("Disposing old video");
    oldVideo.dispose();
  }
}

private void initializeVideo(Movie video) {
  video.loop();
  
  while (video.width == 0) {
   delay(2); 
  } 
}

private void drawObject(Rectangle rect, Contour contour) {
  fill(255, 223, 0);
  stroke(255, 223, 0);
  
  boolean objectIsTheRightSize = rect.width > 10 && rect.height > 5 && rect.height < 50 && rect.width < 50;

  if (objectIsTheRightSize) {
    ellipse((float)rect.getCenterX() * multiplier, (float)rect.getCenterY() * multiplier, 10, 10);
    noFill();
    contour.draw();
    fill(255, 223, 0);
  }
}

private void processFrame(OpenCV opencv) {
  opencv.erode();
  opencv.dilate();
  opencv.dilate();
  opencv.dilate();
  opencv.dilate();
}

private void playSound(Contour contour) {
  for (ToneBar t : toneBars) {
    Rectangle rect = contour.getBoundingBox(); 
    double centerY = rect.getCenterY();
    double distance = Math.abs(centerY * multiplier - t.getY());
    if (distance < 5 && t.shouldPlay(rect.getCenterX() * multiplier)) {
      ellipse((float)rect.getCenterX() * multiplier, (float)rect.getCenterY() * multiplier, 150, 150);      
      sendCarToneMessage(t.getNumber());
    }
  }
}


void movieEvent(Movie m) {
  m.read();
}

private void sendTotalObjectsMessage(int objectsCount) {
  OscMessage objectCountMessage = new OscMessage("/objectcount");
  objectCountMessage.add(objectsCount); 
  oscP5.send(objectCountMessage, abletonReceiver);
}

private void sendCarToneMessage(int toneNumber) {
  OscMessage carToneMessage = new OscMessage("/car-tone");
  carToneMessage.add(toneNumber); 
  oscP5.send(carToneMessage, abletonReceiver);
}

private ArrayList<ToneBar> createToneBars() {
  ArrayList<ToneBar> toneBars = new ArrayList<ToneBar>();

  int numLines = 4;
  int spaceHeight = height / (numLines + 2);
  int line = spaceHeight;
  int i = numLines;

  while(line <= height) {
    toneBars.add(new ToneBar(i, line));
    i--;
    line += spaceHeight;
  }
  
  return toneBars;
}

File[] getLatestFiles(String path) {
  File directory = new File(path);
  File[] filesInDirectory = directory.listFiles();
  return filesInDirectory;
}

String getLatestVideoFileName() {
  String result = "";
  String path = sketchPath();
  path += "/data";
  File[] files = getLatestFiles(path);
  
  if (files.length == 0 || (files.length == 1 && files[0].isDirectory())) {
   println("No video files found."); 
   return "";
  }
  
  Arrays.sort(files, new Comparator<File>()
  {
    public int compare(final File o1, final File o2)
    {
      return Long.compare(o2.lastModified(), o1.lastModified());
    }
  });
    
  
  if (files[0].length() < 1400000) {
    result = files[1].getName();
  } else {
     result = files[0].getName(); 
  }
  return result;
}

private void drawToneBars(ArrayList<ToneBar> toneBars) {
    if (debug) {
    stroke(0);
    for (ToneBar t : toneBars) {
      line(0, t.getY(), width, t.getY()); 
      fill(200);
      rect(0, t.getY(), width, 10);
      fill(255);
    }
  }
}

private class ToneBar {
  private int y;
  private int number;
  private ArrayList<RecentTone> recentTones;
  private int debounceTime = 1000;

  ToneBar(int number, int y) {
    this.number = number;
    this.y = y;
    this.recentTones = new ArrayList<RecentTone>();
  }

  int getNumber() {
    return this.number;
  }

  int getY() {
    return this.y;
  }

  boolean shouldPlay(double x) {
    int now = millis();

    if (this.recentTones.size() == 0) {
      this.recentTones.add(new RecentTone(x, now));
      return true;
    }

    for(RecentTone rt : this.recentTones) {
      double xDifference = Math.abs(rt.x - x);
      int timeDifference = now - rt.timePlayed;

      if ((xDifference < 500) && (timeDifference < this.debounceTime)){
        return false;
      }
    }

    this.recentTones.add(new RecentTone(x, now));
    pruneRecentTones(now);
    
    return true;
  }

  private void pruneRecentTones(int now) {
    List<RecentTone> recentTonesToBeRemoved = new ArrayList<RecentTone>();

    for(RecentTone rt : this.recentTones) {
      if (now - rt.timePlayed > this.debounceTime) {
        recentTonesToBeRemoved.add(rt);
      }
    }

    this.recentTones.remove(recentTonesToBeRemoved);
  }

  private class RecentTone {
    private double x;
    private int timePlayed;

    RecentTone(double x, int timePlayed) {
      this.x = x;
      this.timePlayed = timePlayed;
    }
  }
}
