// problem_1.txt

const readFile = require("../readFile");
const seedsData = {}

function identifyStep(line) {
  console.log('line: ', line);
  const step = line.split(' ')[0]
  console.log('step: ', step, /seeds/.test(step));

  if (! /:/.test(step)) { console.log('number line'); return }
  if (/seeds/.test(step)) { saveSeedsNumbers(line.split(':')[1]); return }
  if( /seed-to-soil*/.test(step)) translateSeedToSoil(line.split(':')[1])
}

function saveSeedsNumbers(data) {
  const seedNumbers = data.trim().split(' ').filter(Boolean)

  seedNumbers.forEach(seedNumber => {
    seedsData[seedNumber] = {}
  });

}

function translateSeedToSoil(){}

function readLine(line) {
  identifyStep(line)
}


function onEnd() {
  console.log("Finished reading the file. Solution:", seedsData);
}



readFile('test_data.txt', readLine, onEnd)








