const NUM_BALLS = 100;
let xposArray = [];
let yposArray = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	// Populate arrays
	for (let i = 0; i < NUM_BALLS; i++) {
		let xpos = random(width);
		xposArray.push(xpos);
		let ypos = random(height);
		yposArray.push(ypos);
	}
}

function draw() {
	background(30, 10);
	fill(255);
	for (let i = 0; i < xposArray.length; i++) {
		// Display
		ellipse(xposArray[i], yposArray[i], 10, 10);
		// Update position
		let stepSize = 5;
		xposArray[i] = xposArray[i] + random(-stepSize, stepSize);
		yposArray[i] = yposArray[i] + random(-stepSize, stepSize);
	}
}