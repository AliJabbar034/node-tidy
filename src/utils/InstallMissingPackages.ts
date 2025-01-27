import fs from "fs";
import { globSync } from "glob";
import getDependencies from "./getDependencies";
import { builtinModules } from "module";

async function findMissingPackages(): Promise<string[]> {
  console.log("Scanning for missing packages...");

  const files = globSync("**/*.{js,jsx,ts,tsx}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  const usedPackages = new Set<string>();
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

  const nodeBuiltinModules = new Set(builtinModules);

  // Find packages used in code but not installed
  const missingPackages: string[] = Array.from(usedPackages).filter(
    (pkg) => !installedPackages.has(pkg) && !nodeBuiltinModules.has(pkg)
  );

  return missingPackages;
}

export default findMissingPackages;
