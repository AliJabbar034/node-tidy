#!/usr/bin/env node

// Check for the module type using `require` or `import`
if (require.main === module) {
  require("../cjs/index.js");
} else {
  // @ts-ignore: Dynamic imports are only supported when the '--module' flag is set to 'es2020', 'es2022', 'esnext', 'commonjs', 'amd', 'system', 'umd', 'node16', or 'nodenext'.
  import("../esm/index.js").catch((err) => {
    console.error("Error loading ESM module:", err);
  });
}
