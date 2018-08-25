const MAX_EMOJIS = 200;
let emoji_array = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  while (emoji_array.length < MAX_EMOJIS) {
    let icon = createSpan();
    icon.position(random(windowWidth), random(windowHeight));
    icon.style("z-index", -1);
    emoji_array.push(icon);
  }
}

function draw() {
  for (let i=0; i<emoji_array.length; i++) {
    let distance = (emoji_array[i].position().x - mouseX)**2 + (emoji_array[i].position().y - mouseY)**2;
    if (distance < 20000) {
      emoji_array[i].class("fas fa-laugh fa-3x");
      emoji_array[i].style("color", color(255, 200, 0));
    } else if (distance < 100000) {
      emoji_array[i].class("fas fa-smile fa-3x");
      emoji_array[i].style("color", color(255, 150, 0));
    } else if (distance < 200000) {
      emoji_array[i].class("fas fa-meh fa-3x");
      emoji_array[i].style("color", color(150, 150, 150));
    } else {
      emoji_array[i].class("fas fa-sad-tear fa-3x");
      emoji_array[i].style("color", color(100, 120, 180));
    }
  }
}

function Icon() {
  this.elmt = createSpan();
  this.elmt.style("z-index", -1);

  this.position(random(windowWidth), random(windowHeight));

  this.updateElement() {
    this.elmt.position(random(windowWidth), random(windowHeight));
  }
}