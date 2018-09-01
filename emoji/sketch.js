const MAX_EMOJIS = 200;
let emoji_array = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  while (emoji_array.length < MAX_EMOJIS) {
    let emoji = new Emoji();
    emoji_array.push(emoji);
  }
}

function draw() {
  for (let i=0; i<emoji_array.length; i++) {
    let thisEmoji = emoji_array[i];
    let distance = calcDistance(thisEmoji.x, thisEmoji.y, mouseX, mouseY);
    if (distance < 300) {
      thisEmoji.laugh();
    } else if (distance < 600) {
      thisEmoji.smile();
    } else if (distance < 800) {
      thisEmoji.meh();
    } else {
      thisEmoji.tear();
    }
    thisEmoji.display();
  }
}

function calcDistance(x1, y1, x2, y2) {
  let dist = sqrt((x1 - x2)**2 + (y1 - y2)**2);
  return dist;
}

function Emoji() {
  this.elmt = createSpan();
  this.elmt.class("fas fa-sad-tear fa-3x");
  this.elmt.style("color", color(50, 80, 120));
  this.elmt.style("z-index", -1);
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  this.angle = round(random(-90, 90));
  this.elmt.position(this.x, this.y);

  this.display = function() {
    this.angle = this.angle + round(random(-2, 2));
    this.elmt.style("transform", `rotate(${this.angle}deg)`);
  }

  this.laugh = function() {
    this.elmt.class("fas fa-laugh fa-3x");
    this.elmt.style("color", color(255, 220, 0));
  }
  this.smile = function() {
    this.elmt.class("fas fa-smile fa-3x");
    this.elmt.style("color", color(255, 220, 100));
  }
  this.meh = function() {
    this.elmt.class("fas fa-meh fa-3x");
    this.elmt.style("color", color(150, 200, 200));
  }
  this.tear = function() {
    this.elmt.class("fas fa-sad-tear fa-3x");
    this.elmt.style("color", color(80, 200, 250));
  }
}