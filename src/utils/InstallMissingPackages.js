const fs = require("fs");
const glob = require("glob");
function findMissingPackages() {
  console.log("Scanning for missing packages...");

  const files = glob.sync("**/*.{js,jsx,ts,tsx}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const usedPackages = new Set();
  const importRegex =
    /(?:import\s.*?from\s['"]|require\(['"])([^'"]+)(?:['"]\))/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const packageName = match[1].split("/")[0]; // Extract the package name
      if (!packageName.startsWith(".")) {
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
