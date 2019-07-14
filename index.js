#!/usr/bin/env node
let program = require("commander");

// modules
const createComponent = require("./modules/createComponent");
const createHook = require("./modules/createHook");

program
  .command("g <component>")
  .option("-c, --class", "Create class component")
  .option("-t, --typescript", "Create typescript file")
  .option("-n, --nofolder", "Do not wrap component in folder")
  .option("-s, --style", "With stylesheet")
  .action(createComponent);

program
  .command("gh <component>")
  .option("-t, --typescript", "Create typescript file")
  .action(createHook);

program.parse(process.argv);
