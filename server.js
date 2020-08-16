const express = require("express");
const package = require("./package.json");
const { watchScripts } = require("./loader");
const { execCommand } = require("./runner");

const app = express();

exports.startServer = ({ port, host, scriptDir }) => {
  console.log('Starting server...')
  const scripts = {};

  watchScripts(scriptDir, (script) => {
    console.log("Loading script", script);
    scripts[script.name] = script;
  });

  app.get("/", (req, res) => {
    res.send({
      status: "ok",
      version: package.version,
    });
  });
  app.get("/:scriptName", async (req, res) => {
    const { scriptName } = req.params;
    if (scripts[scriptName]) {
      const { cmd } = scripts[scriptName];
      try {
        const { stdout, stderr } = await execCommand(cmd, req.query);
        stderr ? res.send(stderr) : res.send(stdout)
      } catch(error) {
        res.status(500).send(error)
      }
    } else {
      res.send("undefined");
    }
  });

  app.listen(port, host, () => {
    console.log(`Server online http://${host}:${port}`);
  });
};
