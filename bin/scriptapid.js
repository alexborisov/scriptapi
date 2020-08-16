#!/usr/bin/env node

const express = require("express");
const { loadScripts, registerScripts } = require("../loader");

const port = 3000;
const scriptPath = `/Users/alex/.config/scriptapi`;

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
