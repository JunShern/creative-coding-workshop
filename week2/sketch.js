let mic;
let currentVolume = 0;
let averageVolume = 0;
let blockPositionY;
let blockHeight;
let blockWidth;

let ballPosition;
let ballDirection;
let color;

function setup() {
  createCanvas(windowWidth, windowHeight);
  blockPositionY = height/2;

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  ballPosition = createVector(width/2, height/2);
  ballDirection = createVector(5, 5);

  color = [random(100,255), random(100,255), random(100,255)];
}

function draw() {
  background(30);
  blockWidth = width / 50;
  blockHeight = height / 5;

  stroke(50);
  let volumeBarWidth = width / 200;
  strokeWeight(volumeBarWidth);
  // Get the smoothed current volume (between 0 and 1.0)
  currentVolume = currentVolume * 0.9 + mic.getLevel() * 0.1;
  currentVolumeBarHeight = map(currentVolume, 0, 1, 0, height);
  currentVolumeBarPosX = width - volumeBarWidth;
  line(currentVolumeBarPosX, height, currentVolumeBarPosX, height - currentVolumeBarHeight);
  // Long term average volume
  averageVolume = averageVolume * 0.99 + mic.getLevel() * 0.01;
  averageVolumeBarHeight = map(averageVolume, 0, 1, 0, height);
  averageVolumeBarPosX = width - 3*volumeBarWidth;
  line(averageVolumeBarPosX, height, averageVolumeBarPosX, height - averageVolumeBarHeight);

  // Block
  let forceY = (currentVolume - averageVolume);
  let gravity = 0.8;
  blockPositionY = blockPositionY + 100*forceY - 10*gravity;
  blockPositionY = constrain(blockPositionY, blockHeight, height);
  noStroke();
  fill(color);
  rect(width - blockWidth*4, height - blockPositionY, blockWidth, blockHeight);

  // Ball
  let ballDiameter = blockWidth * 2;
  ballPosition = ballPosition.add(ballDirection);
  if (ballPosition.x < 0 || ballPosition.x > width) {
	ballDirection.x = -ballDirection.x;
	color = [random(100,255), random(100,255), random(100,255)];
  }
  if (ballPosition.y < 0 || ballPosition.y > height) {
	ballDirection.y = -ballDirection.y;
  }
  if (ballPosition.x > width - blockWidth*4) {
	if (ballPosition.y > (height - blockPositionY) && ballPosition.y < (height - blockPositionY) + blockHeight) {
		ballDirection.x = -ballDirection.x;
	} else {
		ballPosition = createVector(width/2, height/2);
		color = [random(100,255), random(100,255), random(100,255)];
	}
  }
  ballPosition.x = constrain(ballPosition.x, 0, width);
  ballPosition.y = constrain(ballPosition.y, 0, height);
  ellipse(ballPosition.x, ballPosition.y, ballDiameter, ballDiameter);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
