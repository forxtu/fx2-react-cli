#!/usr/bin/env node
let program = require("commander");

// modules
const createComponent = require("./modules/createComponent");
const createHook = require("./modules/createHook");
const createFeature = require("./modules/createFeature");

program
  .command("gc <component>")
  .option("-c, --classComponent", "Create class component")
  .option("-t, --typescript", "Create typescript file")
  .option("-n, --nofolder", "Do not wrap component in folder")
  .option("-g, --global", "Create component in 'src/components' folder")
  .action(createComponent);

program
  .command("gh <hook>")
  .option("-t, --typescript", "Create typescript file")
  .option("-n, --nofolder", "Do not wrap hook in folder")
  .action(createHook);

program
  .command("gf <feature>")
  .option("-t, --typescript", "Create typescript file")
  .option("-g, --global", "Create feature in 'src/features' folder")
  .action(createFeature);

program.parse(process.argv);
