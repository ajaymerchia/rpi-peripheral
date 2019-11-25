var fs = require('fs')

exports.store = (filename, data) => {
  return new Promise(function(resolve, reject) {
    fs.writeFile(`../data/${filename}`, data, (err) => {
      if (err) reject(err);
      else resolve(true)
    })
  });

}

exports.read = (filename) => {
  return new Promise(function(resolve, reject) {
    fs.readFile(`../data/${filename}`, (err, buf) => {
      if (err) reject(err);
      else resolve(buf.toString())
    })
  });
}


function runtest() {
  const test = "random string1"
  const test2 = "random string2"

  process.stdout.write("Testing accuracy on initial write... ");
  exports.store("temp.txt", test)
  .then(() => { return exports.read("temp.txt") })
  .then((data) => {
    console.log((data === test ? "Success!" : `Mismatch Error!\n\treceived: ${data}\n\texpected: ${test}\n\n`));
    process.stdout.write("Testing accuracy on second write... ");
    return exports.store("temp.txt", test2)
  })
  .then(() => { return exports.read("temp.txt") })
  .then((data) => {
    console.log((data === test2 ? "Success!" : `Mismatch Error!\n\treceived: ${data}\n\texpected: ${test}\n\n`));
  })
}

exports.runTest = runtest
