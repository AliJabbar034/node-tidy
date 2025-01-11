const fs = require("fs");

function getDependencies() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  return {
    dependencies: Object.keys(packageJson.dependencies || {}),
    devDependencies: Object.keys(packageJson.devDependencies || {}),
    packageJson,
  };
}

module.exports = getDependencies;
