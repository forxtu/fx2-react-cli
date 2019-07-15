#!/usr/bin/env node
let program = require("commander");

// modules
const createComponent = require("./modules/createComponent");
const createHook = require("./modules/createHook");

program
  .command("g <component>")
  .option("-c, --classComponent", "Create class component")
  .option("-t, --typescript", "Create typescript file")
  .option("-n, --nofolder", "Do not wrap component in folder")
  .action(createComponent);

program
  .command("gh <component>")
  .option("-t, --typescript", "Create typescript file")
  .option("-n, --nofolder", "Do not wrap hook in folder")
  .action(createHook);

program.parse(process.argv);
