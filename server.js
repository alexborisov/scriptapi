const express = require("express");
const { loadScripts, registerScripts } = require("./loader");

const app = express();

exports.startServer = async ({ port, host, scriptDir }) => {
  console.log("Starting server...");
  const scripts = await loadScripts(scriptDir);
  registerScripts(app, scripts);
  app.listen(port, async () => {
    console.log(`Server online http://localhost:${port}`);
  });
};
