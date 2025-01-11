const { execSync } = require("child_process");

function execCommand(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (err) {
    console.error(`Error executing command: ${command}`, err.message);
    return null;
  }
}

module.exports = execCommand;
