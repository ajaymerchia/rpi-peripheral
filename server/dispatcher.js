const child     = require('child_process');
const spawn     = child.spawn

exports.runPythonScript = (filename, cmdlineargs) => {
  if (!cmdlineargs) {
    cmdlineargs = []
  }
  cmdlineargs.unshift(`../robinslight_processes/${filename}`)
  var child = spawn("python", cmdlineargs)
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    console.log(`[python ${filename}] ${chunk}`);
  });
  // since these are streams, you can pipe them elsewhere
  child.stderr.pipe(process.stdout);
  child.on('close', (code) => {
    console.log(`child process [python ${filename}] exited with code ${code}`);
  });
  return child
}

exports.runPythonScriptWithStatus = (filename, cmdlineargs) => {
  function reportFailure() {
    exports.runPythonScript("status_indicator.py", ["red", 45]).on('close', (ignored) => {
      exports.runPythonScript("status_indicator.py", ["green"]);
    })
  }

  exports.runPythonScript("status_indicator.py", ["orange"]).on('close', (ignored) => {
    exports.runPythonScript(filename, cmdlineargs).on('close', (code) => {
      if (code == 0) {
        exports.runPythonScript("status_indicator.py", ["green"]);
      } else {
        reportFailure()
      }
    })
  })



}
