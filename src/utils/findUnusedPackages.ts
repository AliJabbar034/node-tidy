import depcheck, { Results } from "depcheck";
import { UnusedPackages } from "../types/types";

function findUnusedPackages(): Promise<UnusedPackages> {
  console.log("Checking for unused packages. This may take a while...");

  const options: depcheck.Options = {
    ignoreDirs: ["node_modules"],
  };

  return new Promise((resolve, reject) => {
    depcheck(process.cwd(), options, (unused: Results) => {
      const unusedDependencies = unused.dependencies || [];
      const unusedDevDependencies = unused.devDependencies || [];

      resolve({
        dependencies: unusedDependencies,
        devDependencies: unusedDevDependencies,
      });
    });
  });
}

export default findUnusedPackages;
