let mic;
let currentVolume = 0;
let averageVolume = 0;
let blockPositionY;
let blockHeight;
let blockWidth;

let ballPosition;
let ballDirection;
let color;

let score = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	textAlign(CENTER, CENTER);
	textSize(windowWidth/40);

	// Create an Audio input
	mic = new p5.AudioIn();
	mic.start();

	// Game init
	ballPosition = createVector(width/5, height/2);
	ballDirection = createVector(10, random([-5, 5]));
	ballDiameter = height / 20;
	blockPositionY = height / 2;
	blockWidth = width / 50;
	blockHeight = height / 4;
}

function draw() {
	background(30);
	let hue = map(ballPosition.x, 0, width, 0, 255);
	color = [hue, 140, 255];

	// Read volume from mic (between 0 and 1.0)
	currentVolume = currentVolume * 0.9 + mic.getLevel() * 0.1;
	averageVolume = averageVolume * 0.99 + mic.getLevel() * 0.01;
	drawVolumeBars();

	// Block
	let forceY = (currentVolume - averageVolume);
	let gravity = 0.8;
	blockPositionY = blockPositionY - 100*forceY + 10*gravity;
	blockPositionY = constrain(blockPositionY, 0, height - blockHeight);
	noStroke();
	fill(color);
	rect(width - blockWidth*4, blockPositionY, blockWidth, blockHeight);

	// Ball
	updateBallPosition();
	drawBall();

	// Draw score
	fill(color);
	text(score, width/2, height/2);
}

function drawVolumeBars() {
	let volumeBarWidth = width / 200;
	stroke(50);
	strokeWeight(volumeBarWidth);
	// Current volume
	let currentVolumeBarHeight = map(currentVolume, 0, 1, 0, height);
	let currentVolumeBarPosX = width - volumeBarWidth;
	line(currentVolumeBarPosX, height, currentVolumeBarPosX, height - currentVolumeBarHeight);
	// Long term average volume
	let averageVolumeBarHeight = map(averageVolume, 0, 1, 0, height);
	let averageVolumeBarPosX = width - 3*volumeBarWidth;
	line(averageVolumeBarPosX, height, averageVolumeBarPosX, height - averageVolumeBarHeight);
}

function drawBall() {
	ellipse(ballPosition.x, ballPosition.y, ballDiameter, ballDiameter);
	fill(30);
	ellipse(ballPosition.x, ballPosition.y, ballDiameter*2/3, ballDiameter*2/3);
}

function updateBallPosition() {
	ballPosition = ballPosition.add(ballDirection);
	// Collide left
	if (ballPosition.x - ballDiameter/2 < 0) {
		ballDirection.x = -1.1 * ballDirection.x; // Change direction and increase speed
		score = score + 10;
	}
	// Collide top or bottom
	if (ballPosition.y - ballDiameter/2 < 0 || ballPosition.y + ballDiameter/2 > height) {
		ballDirection.y = -ballDirection.y;
	}
	// Collide right
	if (ballPosition.x + ballDiameter/2 > width - blockWidth*4) {
		if (ballPosition.y > blockPositionY && ballPosition.y < blockPositionY + blockHeight) {
			ballDirection.x = -ballDirection.x;
		} else {
			// Lost the game, reset
			background(255);
			score = 0;
			ballPosition = createVector(width/5, height/2);
			ballDirection = createVector(10, random([-5, 5]));
		}
	}
	ballPosition.x = constrain(ballPosition.x, 0, width);
	ballPosition.y = constrain(ballPosition.y, 0, height);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	ballDiameter = height / 20;
	blockWidth = width / 50;
	blockHeight = height / 4;
}
