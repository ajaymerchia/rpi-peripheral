const { spawn }     = require('child_process');

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
}
