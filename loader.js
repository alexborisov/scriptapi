const fs = require("fs");
const util = require("util");
const readline = require("readline");

const readdir = util.promisify(fs.readdir);

function scanFile(path) {
  return new Promise((resolve, reject) => {
    const data = {};
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      crlfDelay: Infinity,
      terminal: false,
    });
    rl.on("line", (line) => {
      const [key, value] = line.split("=");
      data[key] = value;
    });
    rl.on("close", () => {
      resolve({ ...data });
    });
  });
}

async function loadScript(scriptPath) {
  const script = await scanFile(scriptPath)
  return script 
}
async function loadScripts(scriptDir) {
  try {
    const names = await readdir(scriptDir);
    const paths = names.map(name => `${scriptDir}/${name}`)
    const scripts = await Promise.all(
      paths.map((path) => scanFile(path))
    );
    return scripts 
  } catch(error) {
    console.error(error)
    return []
  }
}
async function watchScripts(scriptDir, cb) {
  console.log('watch', scriptDir)
  const scripts = await loadScripts(scriptDir)
  scripts.forEach(cb)
  fs.watch(scriptDir, async(eventType, filename) => {
    console.log('watch', eventType, filename)
    const script = await loadScript(`${scriptDir}/${filename}`)
    cb(script)
  })
}

module.exports = {
  loadScript,
  loadScripts,
  watchScripts
}