var video;

var vScale = 16;
var slider;

var cols;
var rows;

var boxes = [];

function setup() {
  noCanvas();
  // Create a temp checkbox just to calibrate size
  var temp = createCheckbox();
  temp.style('display', 'inline');
  var checkboxW = temp.size().width;
  var checkboxH = temp.size().height;
  temp.style('display', 'none');
  // Figure out how many rows and columns can fit on this screen
  cols = round(0.98 * windowWidth / checkboxW);
  rows = round(0.98*windowHeight / checkboxH);

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(cols, rows);
  slider = createSlider(0, 255, 77);

  for (var y = 0; y < rows; y++) {
    // noprotect
    for (var x = 0; x < cols; x++) {
      var box = createCheckbox();
      box.style('display', 'inline');
      box.parent('mirror');
      boxes.push(box);
    }
    var linebreak = createSpan('<br/>');
    linebreak.parent('mirror');
  }

}

function draw() {
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + 1 + (y * video.width))*4;
      var r = video.pixels[index+0];
      var g = video.pixels[index+1];
      var b = video.pixels[index+2];

      var bright = (r+g+b)/3;

      var threshold = slider.value();

      var checkIndex = x + y * cols;

      if (bright > threshold) {
        boxes[checkIndex].checked(false);
      } else {
        boxes[checkIndex].checked(true);
      }
    }
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
