import fs from "fs";
import { Dependencies } from "../types/types";

function getDependencies(): Dependencies {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  return {
    dependencies: Object.keys(packageJson.dependencies || {}),
    devDependencies: Object.keys(packageJson.devDependencies || {}),
    packageJson,
  };
}

export default getDependencies;
