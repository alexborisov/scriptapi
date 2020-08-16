const util = require("util");
const exec = util.promisify(require("child_process").exec);

function parseCommand(command, params) {
  let out = command;
  for (let param in params) {
    out = out.replace("${" + param + "}", params[param]);
  }
  return out;
}

exports.execCommand = async (command, params = {}) => {
  const cmd = parseCommand(command, params);
  console.log("Executing command", cmd);
  const { stdout, stderr } = await exec(cmd);
  return { stdout, stderr };
};
