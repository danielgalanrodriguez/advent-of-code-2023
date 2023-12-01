const fs = require("fs");
const readline = require("readline");

const fileStream = fs.createReadStream("puzzle.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

let totalCalibrationValue = 0;

const numbersWrittenInLetters = [
  { numberInLetters: "one", digit: 1 },
  { numberInLetters: "two", digit: 2 },
  { numberInLetters: "three", digit: 3 },
  { numberInLetters: "four", digit: 4 },
  { numberInLetters: "five", digit: 5 },
  { numberInLetters: "six", digit: 6 },
  { numberInLetters: "seven", digit: 7 },
  { numberInLetters: "eight", digit: 8 },
  { numberInLetters: "nine", digit: 9 },
];

function checkStringIsNumber(string) {
  return /^[0-9]*$/.test(string);
}

function identifyNumbersWrittenInLetters(string) {
  const numbersFound = numbersWrittenInLetters
    .map(({ numberInLetters, digit }) => {
      const result = string.indexOf(numberInLetters);
      if (result != -1) return { number: digit, index: result };
    })
    .filter(Boolean);

  return numbersFound;
}
function identifyNumbers(string) {
  return string
    .split("")
    .map((char, index) => {
      if (checkStringIsNumber(char)) {
        return {
          number: char,
          index,
        };
      }
    })
    .filter(Boolean);
}

function findIndexes(array) {
  if (!array.length) return -1;

  const sortedArray = array.sort(function (a, b) {
    return a.index - b.index;
  });

  return {
    first: sortedArray[0],
    last: sortedArray.pop(),
  };
}

function recalculateCalibration(firstNumber, lastNumber) {
  let calibrationString = "";
  let calibrationNumber = null;
  calibrationString = `${firstNumber}${lastNumber}`;
  calibrationNumber = Number(calibrationString);
  totalCalibrationValue += calibrationNumber;
}

rl.on("line", (line) => {
  const numbers = identifyNumbers(line);

  const letters = identifyNumbersWrittenInLetters(line);

  if (!numbers.length) {
    let lettersIndexes = findIndexes(letters);
    recalculateCalibration(
      lettersIndexes.first.number,
      lettersIndexes.last.number
    );
    return;
  }

  if (!letters.length) {
    recalculateCalibration(numbers[0].number, numbers.pop().number);
    return;
  }

  const numberIndexes = findIndexes(numbers);
  const lettersIndexes = findIndexes(letters);

  const firstNumber =
    numberIndexes.first.index < lettersIndexes.first.index
      ? numberIndexes.first.number
      : lettersIndexes.first.number;

  const lastNumber =
    numberIndexes.last.index > lettersIndexes.last.index
      ? numberIndexes.last.number
      : lettersIndexes.last.number;

  recalculateCalibration(firstNumber, lastNumber);
});

rl.on("close", () => {
  console.log("Finished reading the file. Solution:", totalCalibrationValue);
});
