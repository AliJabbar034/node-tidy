#!/usr/bin/env node
import fs from "fs";
import execCommand from "../utils/execCommand";
import askUser from "../utils/askUser";
import findUnusedPackages from "../utils/findUnusedPackages";
import getDependencies from "../utils/getDependencies";
import findMissingPackages from "../utils/InstallMissingPackages";
import { Dependencies, UnusedPackages } from "../types/types";

// Handle the removal of unused packages
async function handlePackageRemoval({
  dependencies,
  devDependencies,
  packageJson,
}: Dependencies) {
  if (dependencies.length === 0 && devDependencies.length === 0) {
    console.log("No unused packages found. You're all set!");
    return;
  }

  console.log("Unused packages found:");

  if (dependencies.length > 0) {
    console.log("Dependencies:");
    dependencies.forEach((pkg: string) => console.log(`- ${pkg}`));
  }

  if (devDependencies.length > 0) {
    console.log("DevDependencies:");
    devDependencies.forEach((pkg: string) => console.log(`- ${pkg}`));
  }

  const answer = await askUser(
    "Do you want to remove these unused packages? (yes/no): "
  );

  if (answer === "yes" || answer === "y") {
    await removePackages({ dependencies, devDependencies });
    await handleRollback(packageJson);
  } else {
    console.log("No packages were removed.");
  }
}

// Remove unused packages
function removePackages({ dependencies, devDependencies }: UnusedPackages) {
  [...dependencies, ...devDependencies].forEach((pkg) => {
    console.log(`Removing ${pkg}...`);
    execCommand(`npm uninstall ${pkg}`);
  });
  console.log("Unused packages removed successfully.");
}

// Handle the rollback process if needed
async function handleRollback(packageJson: Record<string, string>) {
  const rollbackAnswer = await askUser(
    "Do you want to rollback the changes? (yes/no): "
  );

  if (rollbackAnswer === "yes" || rollbackAnswer === "y") {
    // const { packageJson } = getDependencies();
    const backupPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync("package.json", backupPackageJson);
    console.log("package.json restored to its original state.");
    console.log("....Installing Removed Package.....");
    execCommand("npm install");
  } else {
    console.log("Changes retained.");
  }
}

const installMissingPackages = async () => {
  // Show missing packages
  const missingPackages = await findMissingPackages();
  if (missingPackages.length > 0) {
    console.log("\nMissing packages detected:");
    missingPackages.forEach((pkg) => console.log(`- ${pkg}`));

    const answer = await askUser(
      "\nDo you want to install these missing packages? (yes/no): "
    );

    if (answer === "yes" || answer === "y") {
      missingPackages.forEach((pkg) => {
        console.log(`Installing ${pkg}...`);
        execCommand(`npm install ${pkg}`);
      });

      console.log("Missing packages installed successfully.");
    }
  } else {
    console.log("\nNo missing packages detected.");
  }
};

async function main() {
  const packageJson: Dependencies = getDependencies();
  const unusedPackages: UnusedPackages = await findUnusedPackages();

  await handlePackageRemoval({
    dependencies: unusedPackages.dependencies,
    devDependencies: unusedPackages.devDependencies,
    packageJson: packageJson.packageJson,
  });

  await installMissingPackages();
}

export default main;
