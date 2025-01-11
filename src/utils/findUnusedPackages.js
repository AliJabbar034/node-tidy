const depcheck = require("depcheck");

function findUnusedPackages() {
  console.log("Checking for unused packages. This may take a while...");

  const options = {
    ignorePatterns: ["node_modules"],
  };

  return new Promise((resolve, reject) => {
    depcheck(process.cwd(), options, (unused) => {
      resolve(unused.dependencies || []);
    });
  });
}

module.exports = findUnusedPackages;
