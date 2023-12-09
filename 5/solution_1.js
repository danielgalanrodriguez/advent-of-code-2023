// problem_1.txt

const readFile = require("../readFile");
let seeds = [];
let seedsData = {};
let currentStep = "";
let lastStep = "";

function identifyLine(line) {
  if (line.length === 0) return;
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
  lastStep = currentStep;
}

function saveSeedsNumbers(data) {
  const seedNumbers = data.trim().split(" ").filter(Boolean);

  seedNumbers.forEach((seedNumber) => {
    seedsData[seedNumber] = {};
    seeds.push(Number(seedNumber));
  });
}

function translateSeedToSoil(data) {
  const [destinationRangeStart, sourceRangeStart, rangeLength] = data;
  const adaptedRange = rangeLength == 0 ? 0 : rangeLength - 1;
  const sourceRangeEnd = sourceRangeStart + adaptedRange;
  // keep track of already valid translations
  seeds.forEach((seed) => {
    let numberToTranslate = seedsData[seed][currentStep];
    if (numberToTranslate == undefined)
      numberToTranslate = seedsData[seed][lastStep];
    if (numberToTranslate == undefined) numberToTranslate = seed;

    seedsData[seed][currentStep] = numberToTranslate;

    if (
      seedsData[seed][lastStep] != undefined &&
      seedsData[seed][lastStep] != seedsData[seed][currentStep]
    ) {
      return;
    }

    if (
      sourceRangeStart <= numberToTranslate &&
      numberToTranslate <= sourceRangeEnd
    ) {
      //calculate destination range
      let lengthToAdd = numberToTranslate - sourceRangeStart;
      seedsData[seed][currentStep] = destinationRangeStart + lengthToAdd;
    }
  });
}

function readLine(line) {
  identifyLine(line);
}

function onEnd() {
  console.log("Finished reading the file. Solution:", seedsData);
}

readFile("test_data.txt", readLine, onEnd);
