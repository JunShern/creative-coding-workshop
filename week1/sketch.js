const BG_COLOR = 30;
let prevX = 0;
let prevY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(120);
  textFont("monospace");
  noStroke();
  background(BG_COLOR);
}

function draw() {
  if (mouseX != prevX && mouseY != prevY) {
    prevX = mouseX;
    prevY = mouseY;

    for (var i=0; i<10; i++) {
      var distanceToCenter = (mouseX - width/2)**2 + (mouseY - height/2)**2;
      if (distanceToCenter < 40000) {
        fill(0, random(255), random(100,255));
      } else {
        fill(random(255), 0, random(100,255));
      }
      
      var spread = 50;
      var brushSize = 10;
      var xpos = mouseX + random(-spread, spread);
      var ypos = mouseY + random(-spread, spread);
      ellipse(xpos, ypos, brushSize, brushSize);
    }
  
    fill(BG_COLOR);
    text("Hello, World!", width/2, height/2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}