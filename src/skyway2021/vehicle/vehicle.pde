
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
    
  Vehicle(float x, float y) {
    this.pos = new PVector(x, y); 
    isDead = false;
  }
  
  public void dazzle() {
    
    float diminish = map(dazzlerations, 0, maxDazzlerations, 255, 0);
    
    push();
    noStroke();
    fill(random(255), diminish);
    rect(pos.x, pos.y, 10, 10);
    pop();
    
    dazzlerations++;
    
    if(dazzlerations > maxDazzlerations) {
      isDead = true;
    }
  }
}
