// problem_1.txt

const fs = require("fs");
const readline = require("readline");

const fileStream = fs.createReadStream("test_data.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

let currentGame = 1
let totalPoints = 0

function stripCardHeader(card) {
  return card.split(':').pop()
}

function getNumbers(card) {
  const cardWithoutHeader = stripCardHeader(card)
  const winning = cardWithoutHeader.split('|')[0].trim()
  const play = cardWithoutHeader.split('|')[1].trim()
  return {
    winning,
    play
  }
}

function checkNumbers({ winning, play }) {
  let correctNumbers = 0
  winning.split(' ').forEach(winningNumber => {
    if (play.includes(winningNumber)) correctNumbers++
  });

  console.log('correctNumbers: ', correctNumbers);
}

rl.on("line", (card) => {
  const numbers = getNumbers(card)
  console.log('numbers: ', numbers);
  checkNumbers(numbers)

});

rl.on("close", () => {
  console.log("Finished reading the file. Solution:", totalPoints);
});
