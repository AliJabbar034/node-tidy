#!/usr/bin/env node
const main = require("./core/main");

main().catch((err) => {
  console.error("An error occurred:", err.message);
  process.exit(1);
});
