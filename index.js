#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");
const readline = require("readline");
const depcheck = require("depcheck");

// Utility to execute shell commands
function execCommand(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (err) {
    console.error(`Error executing command: ${command}`, err.message);
    return null;
  }
}

// Get the list of dependencies from package.json
function getDependencies() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  return {
    dependencies: Object.keys(packageJson.dependencies || {}),
    devDependencies: Object.keys(packageJson.devDependencies || {}),
    packageJson,
  };
}

// Get the list of unused packages using depcheck
async function findUnusedPackages() {
  console.log("Checking for unused packages. This may take a while...");

  const options = {
    ignorePatterns: ["node_modules"],
  };

  return new Promise((resolve, reject) => {
    depcheck(process.cwd(), options, (unused) => {
      const unusedPackages = unused.dependencies || [];
      if (unusedPackages.length > 0) {
        resolve(unusedPackages);
      } else {
        resolve([]);
      }
    });
  });
}

// Ask user for confirmation using readline
function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  if (!fs.existsSync("package.json")) {
    console.error("No package.json found in the current directory.");
    process.exit(1);
  }

  // Get dependencies and check for unused ones
  const { dependencies, devDependencies, packageJson } = getDependencies();
  const unusedPackages = await findUnusedPackages();

  if (unusedPackages.length === 0) {
    console.log("No unused packages found. You're all set!");
    return;
  }

  console.log("Unused packages found:");
  unusedPackages.forEach((pkg) => console.log(`- ${pkg}`));

  // Save a backup of the current package.json in memory
  const backupPackageJson = JSON.stringify(packageJson, null, 2);

  const answer = await askUser(
    "Do you want to remove these unused packages? (yes/no): "
  );

  if (answer === "yes" || answer === "y") {
    unusedPackages.forEach((pkg) => {
      console.log(`Removing ${pkg}...`);
      execCommand(`npm uninstall ${pkg}`);
    });

    console.log("Unused packages removed successfully.");

    // Ask if the user wants to rollback
    const rollbackAnswer = await askUser(
      "Do you want to rollback the changes? (yes/no): "
    );
    if (rollbackAnswer === "yes" || rollbackAnswer === "y") {
      fs.writeFileSync("package.json", backupPackageJson);
      console.log("package.json restored to its original state.");
      execCommand("npm install");
    } else {
      console.log("Changes retained.");
    }
  } else {
    console.log("No packages were removed.");
  }
}

main().catch((err) => {
  console.error("An error occurred:", err.message);
  process.exit(1);
});
