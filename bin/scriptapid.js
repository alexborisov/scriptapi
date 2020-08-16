#!/usr/bin/env node

const express = require("express");
const os = require("os");
const { loadScripts, registerScripts } = require("../loader");

const port = 3000;
const scriptPath = `${os.homedir()}/.config/scriptapi`;

const app = express();

async function start() {
  console.log("Starting daemon...");
  const scripts = await loadScripts(scriptPath);
  registerScripts(app, scripts);
  app.listen(port, async () => {
    console.log(`API server online http://localhost:${port}`);
  });
}

start();
