const BG_COLOR = 30;
const SPREAD = 50;
const BRUSH_SIZE = 10;
let prevX = 0;
let prevY = 0;

// Setup function runs once when the program starts
function setup() {
  // Create a blank canvas which fills its container
  createCanvas(windowWidth, windowHeight);
  // Font setup for Hello, World!
  textFont("monospace");
  textAlign(CENTER, CENTER);
  textSize(120);
  // Don't add an outline around shapes
  noStroke();
  // Set the background color
  background(BG_COLOR);
}

// Draw function is called in an eternal loop after setup
function draw() {
  // We only draw something new when the mouse position changes
  if (mouseX != prevX && mouseY != prevY) {
    prevX = mouseX;
    prevY = mouseY;

    for (let i=0; i<10; i++) {
      // Change color scheme based on the mouse position's distance to the center
      let distanceToCenter = (mouseX - width/2)**2 + (mouseY - height/2)**2;
      if (distanceToCenter < 40000) {
        fill(0, random(255), random(100,255));
      } else {
        fill(random(255), 0, random(100,255));
      }
      
      let xpos = mouseX + random(-SPREAD, SPREAD);
      let ypos = mouseY + random(-SPREAD, SPREAD);
      ellipse(xpos, ypos, BRUSH_SIZE, BRUSH_SIZE);
    }
  
    // Draw text on the screen, with the same color as the background
    fill(BG_COLOR);
    text("Hello, World!", width/2, height/2);
  }
}

// Optional
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}