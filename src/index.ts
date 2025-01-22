#!/usr/bin/env node

import main from "./core/main";

main().catch((err: Error) => {
  console.error("An error occurred:", err.message);
  process.exit(1);
});
