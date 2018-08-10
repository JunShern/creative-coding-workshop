var video;
var videoWidth = 50;
var videoHeight = 30;
var cellWidth, cellHeight;
var cellBrightness = new Array(videoWidth * videoHeight).fill(0);

var slider;
var cbox;
var balls = [];
var numBalls = 100;

var colorPalette = [
  [132,94,194],
  [214,93,177],
  [255,111,145],
  [255,150,113],
  [255,199,95],
  [249,248,113]
];

var imgs = [];
var img_average_color = [];

function preload() {
  for (var i=0; i<2000; i++) {
    var img = loadImage("img/"+i+".jpg")
    imgs.push(img);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(10);
  video = createCapture(VIDEO);
  video.hide();
  video.size(videoWidth, videoHeight);
  cellWidth = width / videoWidth;
  cellHeight = height / videoHeight;

  slider = createSlider(0, 255, 0);
  slider.position(10,10);
  cbox = createCheckbox();
  cbox.position(10,50);

  for (var i=0; i<imgs.length; i++) {
    var img = imgs[i];
    img.loadPixels();
    // console.log(img.pixels);
    var meanColor = [0,0,0];
    for (var x=0; x<img.pixels.length; x = x+4) {
      meanColor[0] = meanColor[0] + img.pixels[x];
      meanColor[1] = meanColor[1] + img.pixels[x+1];
      meanColor[2] = meanColor[2] + img.pixels[x+2];
    }
    meanColor[0] = meanColor[0] / (img.width*img.height);
    meanColor[1] = meanColor[1] / (img.width*img.height);
    meanColor[2] = meanColor[2] / (img.width*img.height);
    img_average_color.push(meanColor);
  }
  
  // for (var i=0; i<numBalls; i++) {
  //   var ball = new Ball();
  //   balls.push(ball);
  // }
}

function colorDistance(color1, color2) {
  var dist = (color1[0] - color2[0])**2 + (color1[1] - color2[1])**2 + (color1[2] - color2[2])**2;
  return dist;
}

function monochromeDistance(color1, color2) {
  var mean1 = (color1[0]+color1[1]+color1[2])/3;
  var mean2 = (color2[0]+color2[1]+color2[2])/3;
  var dist = abs(mean1 - mean2);
  return dist;
}

function draw() {
  background(255);
  video.loadPixels();
  if (video.pixels.length > 0) {
    for (var j=0; j<videoHeight; j++) {
      for (var i=0; i<videoWidth; i++) {
        var pixelIndex = i*4 + (j*videoWidth*4);
        
        var r = video.pixels[pixelIndex];
        var g = video.pixels[pixelIndex + 1];
        var b = video.pixels[pixelIndex + 2];

        var biasBrightness = slider.value();
        var smallestDistance = 100000000;
        var closestColor = [0,0,0];
        
        // Color palette matching
        for (var ind=0; ind<colorPalette.length; ind++) {
          var newDist = monochromeDistance([r+biasBrightness,g+biasBrightness,b+biasBrightness], colorPalette[ind]);
          if (newDist < smallestDistance) {
            smallestDistance = newDist;
            closestColor = colorPalette[ind];
          }
        }

        if ((closestColor[0] + closestColor[1] + closestColor[2])/3 < 200) {
          cellBrightness[i + j*videoWidth] = 0;
        } else {
          cellBrightness[i + j*videoWidth] = 255;
        }

        // Image matching
        var closestIndex = 0;
        smallestDistance = 100000000;
        for (var ind=0; ind<img_average_color.length; ind++) {
          var newDist = colorDistance([r+biasBrightness,g+biasBrightness,b+biasBrightness], img_average_color[ind]);
          if (newDist < smallestDistance) {
            smallestDistance = newDist;
            closestIndex = ind;
          }
        }

        if (cbox.checked()) {
          fill(closestColor);
          rect(i*cellWidth, j*cellHeight, cellWidth, cellHeight);
        } else {
          image(imgs[closestIndex], i*cellWidth, j*cellHeight, cellWidth, cellHeight);
        }
      }
    }
  } else {
    text("Loading video...", width/2, height/2);
  }
}

// function Ball() {
//   this.position = createVector(random(width), random(height));
//   this.diameter = 30;
//   this.color = [255,255,255];
//   this.direction = createVector(random(-5,5), random(-5,5));
//   this.scored = false;
// }
// Ball.prototype.display = function(){
//   fill(this.color);
//   ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
// }
// Ball.prototype.update = function() {
//   // Update direction vector
//   var cellX = round(map(this.position.x, 0, width, 0, videoWidth-1));
//   var cellY = round(map(this.position.y, 0, height, 0, videoHeight-1));
//   if (cellX > 0 && cellX < videoWidth - 1 && cellY > 0 && cellY < videoHeight - 1) {
//     var gradientX = 
//       cellBrightness[cellX+1 + (cellY-1)*videoWidth] + cellBrightness[cellX+1 + cellY*videoWidth] + cellBrightness[cellX+1 + (cellY+1)*videoWidth]
//       - (cellBrightness[cellX-1 + (cellY-1)*videoWidth] + cellBrightness[cellX-1 + cellY*videoWidth] + cellBrightness[cellX-1 + (cellY+1)*videoWidth]);
    
//     var gradientY = 
//       cellBrightness[cellX-1 + (cellY+1)*videoWidth] + cellBrightness[cellX + (cellY-1)*videoWidth] + cellBrightness[cellX+1 + (cellY-1)*videoWidth]
//       - (cellBrightness[cellX-1 + (cellY-1)*videoWidth] + cellBrightness[cellX + (cellY-1)*videoWidth] + cellBrightness[cellX+1 + (cellY-1)*videoWidth]);
    
//     if (abs(gradientX) > 100) {
//       this.direction.x = gradientX / 10;
//     }
//     if (abs(gradientY) > 100) {
//       this.direction.y = gradientY / 10;
//     }
//   }
//   // Add damping
//   this.direction.x = this.direction.x * 0.9;
//   this.direction.y = this.direction.y * 0.9;

//   // Update position
//   this.position.x = this.position.x + this.direction.x;
//   this.position.y = this.position.y + this.direction.y;
//   if (this.position.x <= 0 || this.position.x >= width) {
//     this.direction.x = - this.direction.x;
//   }
//   if (this.position.y <= 0 || this.position.y >= height) {
//     this.direction.y = - this.direction.y;
//   }
//   this.position.x = constrain(this.position.x, 0, width);
//   this.position.y = constrain(this.position.y, 0, height);
// }
// Ball.prototype.checkGoal = function() {
//   if (this.position.x > 100 && this.position.x < 250 && this.position.y > 100 && this.position.y < 250) {
//     return true;
//   } else {
//     return false;
//   }
// }