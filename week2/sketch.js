
var particles = []; 
var numParticles = 50;
var catchSize = 10;
var state = 1;

var islands = [];
var numIslands = 3;

var moon;

var score = 0;
var scoreBrightness = 255;

var waterLevel = 10;
var waterThreshold = 200;
var frameCounter = 0;

var pentatonicScale = [0, 2, 4, 7, 9, 12];
var octave = 6;
var osc;

var starPower = 0;

var sorcerer;
var sorcererPos = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (var i=0; i<numParticles; i++) {
    	particles.push(new Particle(i));
    }
    indexCount = numParticles;

    // Island setup
    for (var i=0; i<numIslands; i++) {
    	var radius = int(random(50,200));
    	islands[i] = new Island(radius);
    	islands[i].create();
    }

    frameRate(20);
}

function draw() {
  background(0,70);

  for (var i=0; i<numIslands; i++) {
    islands[i].display();
  }
  drawWater();
  drawCursor();
  handleParticles();
  
  frameCounter++;
}

function Island(radius) {
	this.numVertices = 20;
	this.verticesX = [];
	this.verticesY = [];
	this.jitter = radius/2;
	this.radius = radius;
	this.centerX = width/4 + random(width/2);
	this.centerY = height;
	this.colors = [];
	this.highestPointX = 0;
	this.highestPointY = height;

	this.create = function() {
		var startAngle = random(TWO_PI);
		for (var i=0; i<this.numVertices; i++) {
			var radians = i*TWO_PI / float(this.numVertices);
			var x = this.centerX + (this.radius*cos(startAngle+radians)) / 2;
			var y = this.centerY + this.radius*sin(startAngle+radians) + random(-this.jitter, this.jitter);
			this.verticesX[i] = x;
			this.verticesY[i] = y;

			// Record highest point to place person there
			if (y < this.highestPointY) {
				this.highestPointX = x;
				this.highestPointY = y;
			}

			colorMode(HSB,100);
			this.colors[i] = color(random(3,10), random(50,90), random(20,60), 30); 
			colorMode(RGB,255);
		}
	}

	this.display = function() {
		//noFill();
		beginShape();
		for (var i=0; i<this.numVertices; i++) {
			vertex(this.verticesX[i],this.verticesY[i]);

			fill(this.colors[i]);
			var x1 = this.verticesX[i];
			var y1 = this.verticesY[i];
			var x2 = this.verticesX[(i+3)%this.numVertices];
			var y2 = this.verticesY[(i+3)%this.numVertices];
			var x3 = this.verticesX[(i+6)%this.numVertices];
			var y3 = this.verticesY[(i+6)%this.numVertices];
			triangle(x1,y1,x2,y2,x3,y3);
		}
		endShape(CLOSE);
		noStroke();
	}
}

function drawWater() {
	var lineGap = 15;
	for (var i=0; i*lineGap<height; i++) {
		var frameOsc = cos(frameCounter*TWO_PI/200.0);
		var lineOsc = sin(i*TWO_PI/25.0);

		// Draw water level	
		colorMode(HSB,100);
		strokeWeight(1);
		stroke(55 + lineOsc*5 - frameOsc*5, 70, 80, 50); //random(200,255), random(150,200), random(0,50));
		colorMode(RGB,255);
		var numJoints = random(5,20);
		for (var j=0; j<numJoints; j++) {
			var x1 = j*width/numJoints;
			var y1 = height-waterLevel+(i*lineGap) + (j%2)*10;
			var x2 = (j+1)*width/numJoints;
			var y2 = height-waterLevel+(i*lineGap) + ((j+1)%2)*5;
			line(x1, y1, x2, y2);
		}
		noStroke();
	}
}

function handleParticles() {
	noStroke();
    for (var i=0; i<numParticles; i++) {
    	if (particles[i].hasChildren) {
    		particles[i].handleChildren();
    	} else {
    		particles[i].display();
	    	particles[i].fall();
	    	particles[i].checkMouse();
	    	//particles[i].melt();
    	}
    }
}

function drawCursor() {
	noCursor(); // In-built function to hide cursor
	// Draw cursor tail
	colorMode(HSB,100);
  strokeWeight(2);
  stroke(12, 30, 100);
	colorMode(RGB,255);
  line(mouseX, mouseY, pmouseX, pmouseY);
  colorMode(HSB,100);
  strokeWeight(2);
  stroke(20, 50, 100);
	colorMode(RGB,255);
	var j = 10;
  line(mouseX+random(-j,j), mouseY+random(-j,j), pmouseX+random(-j,j), pmouseY+random(-j,j));
  
	catchSize = constrain(catchSize-5, 10, 500);
}

function Particle(index) {
	this.x = random(width);
	this.y = random(2*height)-2*height;
	this.index = index;
	this.diameter = random(2, 5);
	this.jitter = 1;
	
	colorMode(HSB,100);
	this.c = color(random(50,60), random(0,70), random(80,100)); 
	colorMode(RGB,255);

	this.children = [];
	this.hasChildren = false;
	this.numChildren = this.diameter;

	this.display = function() {
		fill(this.c);
		ellipse(this.x+random(-this.jitter,this.jitter), this.y+random(-this.jitter,this.jitter), this.diameter, this.diameter);
	}

	this.fall = function() {
		if (this.y >= height-this.diameter/2-waterLevel) {
			this.melt();
		} else {
			this.y = constrain(this.y+7, -2*height, height-waterLevel);
		}
	}

	this.melt = function() {
		if (random(100)>60) this.y = this.y + 1;
		if (random(100)>90) {
			this.diameter = this.diameter-1;
			if (state === 1) {
				waterLevel = constrain(waterLevel+0.3, 0, waterThreshold);
			}
			if (this.diameter <= 0) {
				// Reset particle
				particles[this.index] = new Particle(this.index);
			}
		}
	}

	this.checkMouse = function() {
		if (abs(this.y-mouseY)<catchSize*4 && abs(this.x-mouseX)<catchSize*4) {
			this.explode();
			this.hasChildren = true;
		} 
	}

	this.explode = function() {
		//note = 12*octave + pentatonicScale[int(random(0,pentatonicScale.length))];
		//playNote(note, 300);
		//console.log("A FireChild is born!");
		for (var i=0; i<this.numChildren; i++) {
			if (state === 1) { 
				score = score + 1;
				scoreBrightness = constrain(scoreBrightness+10, 200, 255);
			}
			this.children[i] = new FireChild(i, this.x, this.y);
		}
	}

	this.handleChildren = function() {
		// Check if children have all moved off screen
		var noMoreChildren = true;
		for (var i=0; i<this.numChildren; i++) {
			if (this.children[i].y < height+this.children[i].diameter/2) {
			//if (this.children[i].y > 0) {
				noMoreChildren = false;
			}
		}
		if (noMoreChildren) {
			// Reset particle
			particles[this.index] = new Particle(this.index);
		} else {
			// Move and show children
			for (var i=0; i<this.numChildren; i++) {
				this.children[i].move();
				this.children[i].display();
			}	
		}
		
	}
}

function FireChild(index, xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
	this.velX = random(-8,8);
	this.velY = random(-5,5);
	this.diameter = random(1,2);
	this.c = 255; 

	this.display = function() {
		if (random(100) > 50) {
			fill(this.c);
			ellipse(this.x, this.y, this.diameter, this.diameter);
		}
	}

	this.move = function() {
		this.x = this.x + this.velX;
		this.y = this.y + this.velY;
		this.x = this.x - (this.x/abs(this.x));
		this.velY = this.velY + 2;
	}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}