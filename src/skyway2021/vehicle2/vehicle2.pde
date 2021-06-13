ArrayList<Vehicle> vehicles;
int vehicleLimit = 300;
int maxDazzlerations = 100;

void setup() {
  size(800, 600);
  vehicles = new ArrayList<Vehicle>();
}

void draw() {
  background(0);
  drawDazzle(mouseX, mouseY); 
}

void drawDazzle(float x, float y) {
  
  //add new vehicles if under max limit
  if(vehicles.size() < vehicleLimit) {
    vehicles.add(new Vehicle(x, y));
  }
  
  // dazzle vehicles or remove em if they die
  for(int i = 0; i < vehicles.size(); i++) {  
    Vehicle v = vehicles.get(i);
    
    if(vehicles.get(i).isDead) {
      vehicles.remove(i);
    } else {
      v.dazzle();
    }
  }
}

class Vehicle {
  
  PVector pos;
  public boolean isDead;
  int dazzlerations = 0;
  int boxSize = 10; //adjust as needed
    
  Vehicle(float x, float y) {
    this.pos = new PVector(x, y); 
    isDead = false;
  }
  
  public void dazzle() {
    
    float diminish = map(dazzlerations, 0, maxDazzlerations, 255, 0);
    
    push();
      rectMode(CENTER);
      noStroke();

      //3x3 grid
      
      //top left
      fill(random(255), diminish);
      rect(pos.x - boxSize, pos.y - boxSize, boxSize, boxSize);
      
      //top center
      fill(random(255), diminish);
      rect(pos.x, pos.y - boxSize, boxSize, boxSize);
      
      //top right
      fill(random(255), diminish);
      rect(pos.x + boxSize, pos.y - boxSize, boxSize, boxSize);
      
      //center left
      fill(random(255), diminish);
      rect(pos.x - boxSize, pos.y, boxSize, boxSize);
      
       //center
      fill(random(255), diminish);
      rect(pos.x, pos.y, boxSize, boxSize);
      
      //center right
      fill(random(255), diminish);
      rect(pos.x + boxSize, pos.y, boxSize, boxSize);
      
      //bottom left
      fill(random(255), diminish);
      rect(pos.x - boxSize, pos.y + boxSize, boxSize, boxSize);
      
      //bottom center
      fill(random(255), diminish);
      rect(pos.x, pos.y + boxSize, boxSize, boxSize);
      
      //bottom center
      fill(random(255), diminish);
      rect(pos.x + boxSize, pos.y + boxSize, boxSize, boxSize);
      
    pop();
    
    dazzlerations++;
    
    if(dazzlerations > maxDazzlerations) {
      isDead = true;
    }
  }
}
