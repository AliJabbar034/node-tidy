import { execSync } from "child_process";

function execCommand(command: string): string | null {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (err: any) {
    console.error(`Error executing command: ${command}`, err.message);
    return null;
  }
}

export default execCommand;
