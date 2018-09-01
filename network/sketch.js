const NUM_DOTS = 100;
const LINK_THRESHOLD = 200;
let dotArrayX = [];
let dotArrayY = [];
let directionArrayX = [];
let directionArrayY = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < NUM_DOTS; i++) {
    dotArrayX.push(random(width));
    dotArrayY.push(random(height));
    directionArrayX.push(random(-1, 1));
    directionArrayY.push(random(-1, 1));
  }
}

function draw() {
  background(20);
  for (let i = 0; i < dotArrayX.length; i++) {
    for (let j=0; j<dotArrayX.length; j++) {
      let x1 = dotArrayX[i];
      let y1 = dotArrayY[i];
      let x2 = dotArrayX[j];
      let y2 = dotArrayY[j];
      let distance = calcDistance(x1, y1, x2, y2);
      let monoColor = 255 - 255 * distance / LINK_THRESHOLD;
      if (distance < LINK_THRESHOLD) {
        stroke(monoColor, 100, 150);
        line(x1, y1, x2, y2);
      }
    }

    dotArrayX[i] = dotArrayX[i] + directionArrayX[i];
    dotArrayY[i] = dotArrayY[i] + directionArrayY[i];
    if (dotArrayX[i] < 0 || dotArrayX[i] > width) {
      directionArrayX[i] = -directionArrayX[i];
      dotArrayX[i] = constrain(dotArrayX[i], 0, width);
    }
    if (dotArrayY[i] < 0 || dotArrayY[i] > height) {
      directionArrayY[i] = -directionArrayY[i];
      dotArrayY[i] = constrain(dotArrayY[i], 0, height);
    }
    ellipse(dotArrayX[i], dotArrayY[i], 2, 2);
  }
}

function calcDistance(x1, y1, x2, y2) {
  let dist = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return dist;
}
