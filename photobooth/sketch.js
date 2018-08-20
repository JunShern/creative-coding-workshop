/*
Images from https://pjreddie.com/projects/cifar-10-dataset-mirror/
*/

let video;
let videoWidth = 60;
let videoHeight;
let slider;
let colorSelector;
let cnv;

let colorPalettes = {
  "Retro fire": [[132,94,194], [214,93,177], [255,111,145], [255,150,113], [255,199,95], [249,248,113]], // Orange-purple
  "Dunno": [[248,255,229], [6,214, 160], [27,154,170], [239,71,111], [255,196,61]],
  "Toucan": [[87,117,144], [243,202,64], [242,165,65], [240,138,75], [215,138,118]],
  "Icicle": [[3,37,108], [37,65,178], [23,104,172], [6,190,225], [255,255,255]],
  "Fruit punch": [[88,107,164], [50,67,118], [245,221,144], [246,142,95], [247,108,94]],
  "Hepburn": [[255,234,208], [247,111,142], [1500,97,107], [55,80,92], [17,53,55]],
  "Desert poster": [[164,36,59], [216,201,155], [216,151,60], [189,99,47], [39,62,71]],
  "Bob Marley": [[142,166,4], [245,187,0], [236,159,5], [215,106,3], [191,49,0]],
  "Skyscraper": [[43,65,65],[14,177,210],[52,228,234],[138,185,181],[200,194,174]]
};

let colorPalette = colorPalettes["Retro fire"];

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(10);
  video = createCapture(VIDEO);
  video.hide();

  // DOM UI
  slider = createSlider(0, 255, 100);
  slider.position(10,10);

  colorSelector = select('#selector');
  for (let i=0; i<Object.keys(colorPalettes).length; i++) {
    colorSelector.option(Object.keys(colorPalettes)[i]);
  }
  colorSelector.changed(updateColorPalette);

  saveButton = select('#saveButton');
  saveButton.mousePressed(takePicture);
}

function takePicture() {
  // saveCanvas();
  let timestamp = Date.now()
  saveFrames('photobooth_' + timestamp, 'png', 1, 2);
}

function updateColorPalette() {
  colorPalette = colorPalettes[colorSelector.value()];
}

function colorDistance(color1, color2) {
  let dist = (color1[0] - color2[0])**2 + (color1[1] - color2[1])**2 + (color1[2] - color2[2])**2;
  return dist;
}

function monochromeDistance(color1, color2) {
  let mean1 = (color1[0]+color1[1]+color1[2])/3;
  let mean2 = (color2[0]+color2[1]+color2[2])/3;
  let dist = abs(mean1 - mean2);
  return dist;
}

function draw() {
  background(30);
  video.loadPixels();
  if (video.pixels.length > 0) {
    // Only the first time
    if (video.width != videoWidth) {
      videoHeight = round(video.height * videoWidth / video.width);
      video.size(videoWidth, videoHeight);
    }
  
    for (let j=0; j<videoHeight; j++) {
      for (let i=0; i<videoWidth; i++) {
        let h = height / videoHeight;
        let w = h; //width / videoWidth;
        let pixelIndex = i*4 + (j*videoWidth*4);
        
        let r = video.pixels[pixelIndex];
        let g = video.pixels[pixelIndex + 1];
        let b = video.pixels[pixelIndex + 2];
        let a = video.pixels[pixelIndex + 3];
        let brightness = (r + g + b) / 3;

        let closestColor = [0,0,0];
        let smallestDistance = 100000000;

        let biasBrightness = slider.value();
        for (let ind=0; ind<colorPalette.length; ind++) {
          let newDist = monochromeDistance([r+biasBrightness,g+biasBrightness,b+biasBrightness], colorPalette[ind]);
          if (newDist < smallestDistance) {
            smallestDistance = newDist;
            closestColor = colorPalette[ind];
          }
        }
        fill(closestColor);
        rect(i*w, j*h, w, h);
      }
    }
  } else {
    text("Loading video...", width/2, height/2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
