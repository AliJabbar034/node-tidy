#!/usr/bin/env node
const fs = require("fs");
const execCommand = require("../utils/execCommand");
const askUser = require("../utils/askUser");
const findUnusedPackages = require("../utils/findUnusedPackages");
const getDependencies = require("../utils/getDependencies");

// Handle the removal of unused packages
async function handlePackageRemoval(unusedPackages) {
  if (unusedPackages.length === 0) {
    console.log("No unused packages found. You're all set!");
    return;
  }

  console.log("Unused packages found:");
  unusedPackages.forEach((pkg) => console.log(`- ${pkg}`));

  const answer = await askUser(
    "Do you want to remove these unused packages? (yes/no): "
  );

  if (answer === "yes" || answer === "y") {
    await removePackages(unusedPackages);
    await handleRollback();
  } else {
    console.log("No packages were removed.");
  }
}

// Remove unused packages
function removePackages(unusedPackages) {
  unusedPackages.forEach((pkg) => {
    console.log(`Removing ${pkg}...`);
    execCommand(`npm uninstall ${pkg}`);
  });
  console.log("Unused packages removed successfully.");
}

// Handle the rollback process if needed
async function handleRollback() {
  const rollbackAnswer = await askUser(
    "Do you want to rollback the changes? (yes/no): "
  );

  if (rollbackAnswer === "yes" || rollbackAnswer === "y") {
    const { packageJson } = getDependencies();
    const backupPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync("package.json", backupPackageJson);
    console.log("package.json restored to its original state.");
    execCommand("npm install");
  } else {
    console.log("Changes retained.");
  }
}

async function main() {
  const { packageJson } = getDependencies();
  const unusedPackages = await findUnusedPackages();

  await handlePackageRemoval(unusedPackages);
}

module.exports = main;
