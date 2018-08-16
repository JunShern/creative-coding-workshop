var balls = [];
var numBalls = 200;
var colorPalette = [
  [132,94,194],
  [214,93,177],
  [255,111,145],
  [255,150,113],
  [255,199,95],
  [249,248,113]
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(20);
  for (var i=0; i<numBalls; i++) {
    var ball = new Ball();
    balls.push(ball);
  }
}

function draw() {
  background(30);
  for (var i=0; i<balls.length; i++) {
    balls[i].display();
    balls[i].update();
  }
}

function Ball() {
  this.position = createVector(random(width), random(height));
  this.diameter = random(5, 20);
  this.color = random(colorPalette); //[255, random(255), 100];
  this.direction = createVector(random(-5,5), random(-5,5));

  this.display = function(){
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
  };
  this.update = function() {
    // Add damping
    this.direction.x = this.direction.x * 0.97;
    this.direction.y = this.direction.y * 0.97;

    // Reset direction if almost stopped
    if (abs(this.direction.x) + abs(this.direction.y) < 0.1) {
      this.direction = createVector(random(-5,5), random(-5,5));
    }

    // Update position
    this.position.x = this.position.x + this.direction.x;
    this.position.y = this.position.y + this.direction.y;
    if (this.position.x <= 0 || this.position.x >= width) {
      this.direction.x = - this.direction.x;
    }
    if (this.position.y <= 0 || this.position.y >= height) {
      this.direction.y = - this.direction.y;
    }
    this.position.x = constrain(this.position.x, 0, width);
    this.position.y = constrain(this.position.y, 0, height);
  };
}