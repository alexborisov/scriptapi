const fs = require("fs");
const util = require("util");
const readline = require("readline");
const { execCommand } = require("./runner");

const readdir = util.promisify(fs.readdir);

async function listFiles(path) {
  try {
    const names = await readdir(path);
    return [...names];
  } catch (error) {
    console.error("failed to list files", error);
    return [];
  }
}
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

exports.loadScripts = async (path = "~/.config/scriptapi") => {
  console.log(`Loading scripts [${path}]...`);
  try {
    const files = await listFiles(path);
    const scripts = await Promise.all(
      files.map((fileName) => scanFile(`${path}/${fileName}`))
    );
    console.log("Scripts loaded", scripts);
    return [...scripts];
  } catch (error) {
    console.error("Failed to load scripts", error);
    return [];
  }
};
exports.registerScripts = async (app, scripts = []) => {
  console.log(`Registering scripts...`, scripts);

  scripts.forEach(({ name, cmd }) => {
    app.get(`/${name}`, async (req, res) => {
      const result = await execCommand(cmd, req.query);
      res.send(result);
    });
    console.log(`Registered /${name}`);
  });
  console.log("Scripts registered");
};
