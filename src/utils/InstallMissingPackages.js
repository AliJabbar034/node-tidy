const fs = require("fs");
const glob = require("glob");
const getDependencies = require("./getDependencies");

function findMissingPackages() {
  console.log("Scanning for missing packages...");

  const files = glob.sync("**/*.{js,jsx,ts,tsx}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const usedPackages = new Set();
  const importRegex =
    /\b(?:import(?:["'\s]*[\w*{}\n, ]+from\s*)?["']([^"']+)["']|require\(["']([^"']+)["']\))/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const packageName = (match[1] || match[2] || "").split("/")[0]; // Extract the package name
      if (packageName && !packageName.startsWith(".")) {
        usedPackages.add(packageName);
      }
    }
  }

  const installedPackages = new Set([
    ...getDependencies().dependencies,
    ...getDependencies().devDependencies,
  ]);

  // Find packages used in code but not installed
  const missingPackages = Array.from(usedPackages).filter(
    (pkg) => !installedPackages.has(pkg)
  );

  return missingPackages;
}

module.exports = findMissingPackages;
