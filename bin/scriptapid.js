#!/usr/bin/env node

const os = require("os");
const { program } = require("commander");
const package = require("../package.json");
const { startServer } = require("../server");

program
  .version(package.version)
  .option("-p, --port <port>", "server port", 3000)
  .option("-h, --host <host>", "server host", "localhost")
  .option(
    "-s, --scriptDir <path>",
    "location of scripts",
    `${os.homedir()}/.config/scriptapi`
  );

program.parse(process.argv);

startServer({
  port: program.port,
  host: program.host,
  scriptDir: program.scriptDir,
});
