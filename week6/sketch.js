// Data source: https://www.kaggle.com/rakannimer/billboard-lyrics
// Columns: "Rank","Song","Artist","Year","Lyrics","Source"

let table;
const BASE_YEAR = 1965;
const MAX_YEAR = 2015;
const NUM_YEARS = MAX_YEAR - BASE_YEAR + 1;
let wordCountByYear = [];
let filteredWordCountByYear = [];
let largestWordCount = 0;

function preload() {
  table = loadTable('week6/billboard_lyrics_1964-2015.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i=0; i<NUM_YEARS; i++) {
    wordCountByYear.push({});
  }
  // console.log(table.getRowCount() + ' total rows in table');
  // console.log(table.getColumnCount() + ' total columns in table');

  for (let r = 0; r < table.getRowCount(); r++) {
    // Year
    let year = table.getNum(r, "Year");
    let wordCount = wordCountByYear[year - BASE_YEAR];
    
    // Process lyrics
    let lyrics = table.getString(r, "Lyrics");
    let words = lyrics.split(" ");
    for (let i=0; i<words.length; i++) {
      if (words[i] in wordCount) {
        wordCount[words[i]] = wordCount[words[i]] + 1;
        if (wordCount[words[i]] > largestWordCount) {
          largestWordCount = wordCount[words[i]];
        }
      } else {
        wordCount[words[i]] = 1;
      }
    }
  }

  // // Remove all words that occur fewer than 100 times
  // for (let i=0; i<wordCountByYear.length; i++) {
  //   let wordCount = wordCountByYear[i];
  //   for (var word in wordCount) {
  //     if (wordCount.hasOwnProperty(word)) {
  //       if (wordCount[word] < 100) {
  //         // console.log(`Deleting ${word} from ${i}`);
  //         delete wordCount[word];
  //       }
  //     }
  //   }
  // }

  // Sort words by frequency
  for (let i=0; i<wordCountByYear.length; i++) {
    let wordCount = wordCountByYear[i];
    let arrayWordCount = [];
    for (var word in wordCount) {
      if (wordCount.hasOwnProperty(word)) {
        arrayWordCount.push([word, wordCount[word]]);
      }
    }
    arrayWordCount.sort(function(a, b) {
      return a[1] - b[1];
    });

    // Keep only the 100 most frequent words
    arrayWordCount.splice(0, arrayWordCount.length - 50);
    wordCount = {};
    for (let j=0; j<arrayWordCount.length; j++) {
      wordCount[arrayWordCount[j][0]] = arrayWordCount[j][1];
    }
    filteredWordCountByYear[i] = wordCount;
  }

  // Get all words across all years
  allWords = {};
  for (let i=0; i<filteredWordCountByYear.length; i++) {
    let wordCount = filteredWordCountByYear[i];
    for (var word in wordCount) {
      if (wordCount.hasOwnProperty(word)) {
        // Add the word if we haven't seen it before
        if (word in allWords) {
          allWords[word] = allWords[word] + wordCount[word];
        } else {
          allWords[word] = wordCount[word];
        }
      }
    }
  }
  // Convert to array
  allWordsArray = [];
  for (var word in allWords) {
    allWordsArray.push([word, allWords[word]]);
  }
  // Sort words by frequency
  allWordsArray.sort(function(a, b) {
    return a[1] - b[1];
  });
  for (let i=0; i<allWordsArray.length; i++) {
    allWordsArray[i] = allWordsArray[i][0];
  }
}

function draw() {
  background(30);
  let yearIndex = round(map(mouseX, 0, width, 0, NUM_YEARS-1));
  let wordCount = wordCountByYear[yearIndex];

  textSize(16);
  for (let i=0; i<allWordsArray.length; i++) {
    let word = allWordsArray[i];
    let w = width / allWordsArray.length;
    let h;
    if (word in wordCount) { 
      h = (height - 50) * wordCount[word] / largestWordCount;
      let colorVal = map(h, 0, largestWordCount/3, 0, 255);
      fill(colorVal, 250 - colorVal/2, 255 - colorVal);
      rect(i*w, height - h, w, height);
  
      push();
      translate((i+1)*w, height - h);
      rotate(3*HALF_PI);
      fill(255);
      text(`${allWordsArray[i]} (${wordCount[word]})`, 2, 0);
      pop();
    } else {
      h = 0;
    }
  }

  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text(`Popular words from the songs of the Billboard Hot 100`, width/2, height/2);
  textAlign(LEFT, TOP);
  textSize(50);
  text(`${yearIndex + BASE_YEAR}`, width/2, height/2 + 10);
  pop();
}