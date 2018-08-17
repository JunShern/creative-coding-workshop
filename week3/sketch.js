// App parameters
MAX_ITERATIONS = 150;
MAX_NODES = 400;
// Tree parameters
MAX_CHILDREN = 6;
MAX_DEPTH = 2;
BIRTH_RADIUS = Math.min(window.innerWidth, window.innerHeight) / 6;
NOISE = BIRTH_RADIUS/4;

var iteration_count = 0;
var node_count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  button = createButton('Reset');
  button.position(20, height-40);
  button.mousePressed(reset);

  rootNode = new Node(null);
  rootNode.display();
  frameRate(10); // Limit framerate for cross-device consistency
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (node_count < MAX_NODES) {
    rootNode.maybeGrow();
  }
}

function reset() {
  background(255);
  rootNode = new Node(null);
  rootNode.display();
  iteration_count = 0;
  node_count = 0;
}

// ----------------------------------------------------------------------

function normalize(x, y) {
  mag = sqrt(x**2 + y**2);
  return [x/mag, y/mag];
}

function calcOutwardVector(x, y) {
  // Returns an [x,y] vector away from the canvas center
  vx = x - width/2;
  vy = y - height/2;
  // Return some noise if x, y are directly at the center
  if (vx == 0 && vy == 0) {
    vx = random(-NOISE, NOISE);
    vy = random(-NOISE, NOISE);
  }
  return normalize(vx, vy);
}

function Node(parentNode) {
  this.depth = parentNode ? parentNode.depth + 1 : 0;
  this.diameter = random(2,BIRTH_RADIUS/7);
  this.parent = parentNode;
  this.children = [];
  this.c = color(0, random(this.depth*50));
  // Calculate direction away from center
  this.outwardVector = parentNode ? calcOutwardVector(parentNode.x, parentNode.y) : null;
  // Update own coordinates as parent's coordinates + outwardVector, with some noise
  this.x = parentNode ? 
    parentNode.x + random(-BIRTH_RADIUS/2, BIRTH_RADIUS) * this.outwardVector[0] + random(-NOISE, NOISE) : 
    width/2;
  this.y = parentNode ? 
    parentNode.y + random(-BIRTH_RADIUS/2, BIRTH_RADIUS) * this.outwardVector[1] + random(-NOISE, NOISE) : 
    height/2;

  this.display = function() {
    fill(this.c);
    strokeWeight(1);
    stroke(this.c);
    if (this.parent) { // The root node doesn't have a parent
        line(this.parent.x, this.parent.y, this.x, this.y);
    }
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  this.maybeGrow = function() {
    if (this.depth <= MAX_DEPTH && this.children.length <= MAX_CHILDREN && random(100) > 50) {
      babyNode = new Node(this);
      babyNode.display();
      this.children.push(babyNode);
      node_count++;
    }
    // Recursively grow children
    this.children.forEach(childNode => {
      childNode.maybeGrow();
    });
  }
}