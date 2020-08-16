const express = require("express");
const package = require("./package.json");
const { watchScripts } = require("./loader");
const { execCommand } = require("./runner");

const app = express();

exports.startServer = ({ port, scriptDir }) => {
  const scripts = {};

  watchScripts(scriptDir, (script) => {
    console.log("load script", script);
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
      const result = await execCommand(cmd, req.query);
      res.send(result.stdout);
    } else {
      res.send("undefined");
    }
  });

  app.listen(port, () => {
    console.log(`Server online http://localhost:${port}`);
  });
};
