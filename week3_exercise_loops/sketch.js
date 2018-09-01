
function setup() {
	createCanvas(700, 700);
}

function draw() {
	background(30);
	let numColumns = 5;
	let numRows = 5;
	let columnWidth = width / numColumns;
	let rowHeight = height / numRows;
	for (let i = 0; i < numColumns; i++) {
		for (let j = 0; j < numRows; j++) {
			let boxCount = j * numColumns + i;
			if (boxCount % 2 === 0) {
				fill(255);
			} else {
				fill(0);
			}
			rect(i * columnWidth, j * rowHeight, columnWidth, (j + 1) * rowHeight);	
		}
	}
}

function calcDistance(x1, y1, x2, y2) {
	let dist = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	return dist;
}
