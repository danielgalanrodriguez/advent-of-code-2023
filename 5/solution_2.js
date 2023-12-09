// problem_2.txt
// refactored to process 1 seed at a time to about memory problems
// needs to have a sync readfile
const readFile = require("../readFile");
let seedDataLength = 1
let rangeStartIndex = 0
let rangeLengthIndex = rangeStartIndex + 1
let currentIndex = 0
let seed = null;
let seedData = {};
let currentStep = "";
let lastStep = "";
let lowestLocation = -1

function processLine(line) {
  if (line.length === 0) {
    if (currentStep) lastStep = currentStep;
    return
  };

  const step = line.split(":")[0];

  if (/seeds/.test(step)) {
    saveSeedsNumbers(line.split(":")[1]);
    return;
  }
  if (/map/.test(step)) {
    currentStep = step;
    return;
  }
  const data = line.split(" ").map((data) => Number(data));
  translateSeedToSoil(data);
}

function saveSeedsNumbers(data) {
  const seedRanges = data.trim().split(" ").filter(Boolean);
  let seedRangeStart = Number(seedRanges[rangeStartIndex])
  let seedRangeLength = Number(seedRanges[rangeLengthIndex])
  console.log('seedRanges.length: ', seedRanges.length);
  console.log('seedRangeStart: ', seedRangeStart);
  console.log('seedRangeLength: ', seedRangeLength);


  seed = seedRangeStart + currentIndex
  currentIndex++
  if (currentIndex >= seedRangeLength) {
    rangeStartIndex += 2
    rangeLengthIndex = rangeStartIndex + 1
  }
}

function translateSeedToSoil(data) {
  const [destinationRangeStart, sourceRangeStart, rangeLength] = data;
  const adaptedRange = rangeLength - 1;
  const sourceRangeEnd = sourceRangeStart + adaptedRange;
 
    let numberToTranslate = seedData[currentStep];
    if (numberToTranslate == undefined)
      numberToTranslate = seedData[lastStep];
    if (numberToTranslate == undefined) numberToTranslate = seed;

    seedData[currentStep] = numberToTranslate;

    // First step
    if (seedData[lastStep] == undefined) {
      if (seedData[currentStep] != numberToTranslate) return
    }
    else {
      // Rest of the steps
      if (seedData[lastStep] != seedData[currentStep]) {
        return;
      }
    }

    if (
      sourceRangeStart <= numberToTranslate &&
      numberToTranslate <= sourceRangeEnd
    ) {
      //calculate destination range
      let lengthToAdd = numberToTranslate - sourceRangeStart;
      seedData[seed][currentStep] = destinationRangeStart + lengthToAdd;
    }

}

function onEnd() {
  const lowestLocationNumber = getLowestLocationNumber()
  console.log("Finished reading the file. Solution:", lowestLocationNumber);
}

function getLowestLocationNumber() {
    const seedLocation = seedData['humidity-to-location map']
    if(lowestLocation == -1) lowestLocation = seedLocation
    if (seedLocation < lowestLocation) lowestLocation = seedLocation
}

async function processFile() {

  await readFile("test_data.txt", processLine, onEnd);

  while (rangeStartIndex < seedDataLength) {
   await readFile("test_data.txt", processLine, onEnd);
  }

  console.log("Finished processing all seeds. Solution:", lowestLocationNumber);

}

processFile()

