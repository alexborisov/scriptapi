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
  try {
    const script = await scanFile(scriptPath);
    return script;
  } catch (error) {
    return null;
  }
}
async function loadScripts(scriptDir) {
  try {
    const names = await readdir(scriptDir);
    const paths = names.map((name) => `${scriptDir}/${name}`);
    const scripts = await Promise.all(paths.map((path) => scanFile(path)));
    return scripts;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function watchScripts(scriptDir, cb) {
  console.log("Watching scripts", scriptDir);
  try {
    const scripts = await loadScripts(scriptDir);
    scripts.forEach(cb);
  } catch (error) {
    console.error("failed to load scripts", error);
  }
  fs.watch(scriptDir, async (eventType, filename) => {
    console.log("Script changed", eventType, filename);
    try {
      const script = await loadScript(`${scriptDir}/${filename}`);
      cb(script);
    } catch (error) {
      console.error("failed to load script", error);
    }
  });
}

module.exports = {
  loadScript,
  loadScripts,
  watchScripts,
};
