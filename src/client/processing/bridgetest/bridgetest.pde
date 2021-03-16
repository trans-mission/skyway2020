import processing.video.*;
Movie syn;

void setup() {
  size(352,240);
  String camURL = "https://34-d7.divas.cloud/CHAN-4548/CHAN-4548_1.stream/playlist.m3u8";
  println(camURL);
  syn = new Movie(this, camURL);
  syn.play();
}

void draw() {
  if (syn.available()) {
    syn.read();
  }
  image(syn, 0, 0, width, height);
}
