let xpos;
let ypos;

function setup() {
  createCanvas(windowWidth, windowHeight);
  xpos = width / 2;
  ypos = height / 2;
}

function draw() {
  background(0);
  ellipse(xpos, ypos, 100, 100);
  // Move the ball towards the right
  xpos = xpos + 5;
  // If the ball has moved past the canvas, reset xpos to 0
  if (xpos > width) {
	  xpos = 0;
  }
}