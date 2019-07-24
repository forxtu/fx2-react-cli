#!/usr/bin/env node
let program = require("commander");

// modules
const createComponent = require("./modules/createComponent");
const createHook = require("./modules/createHook");
const createFeature = require("./modules/createFeature");

program
  .version(require("./package.json").version, "-v, --version")
  .on("--help", function() {
    console.log("Examples:".bgCyan.black);
    console.log("");
    console.log("  fx2 gc MyGreatComponent");
    console.log("  fx2 gh path/to/useGreatHook -g");
    console.log("  fx2 gf MyGreatFeature -t");
    console.log("");
  });

program
  .command("gc <component>")
  .description("Generates component (functional and JS by default)")
  .option("-c, --classcomponent", "Create class component")
  .option("-t, --typescript", "Create typescript component file")
  .option("-n, --nofolder", "Do not wrap component in folder")
  .option("-g, --global", "Create component in 'src/components' folder")
  .action(createComponent);

program
  .command("gh <hook>")
  .description("Generates hook (JS by default)")
  .option("-t, --typescript", "Create typescript hook file")
  .option("-n, --nofolder", "Do not wrap hook in folder")
  .option("-g, --global", "Create hook in 'src/hooks' folder")
  .action(createHook);

program
  .command("gf <feature>")
  .description(
    "Generates feature folder structure (JS by default, using react-redux)"
  )
  .option("-t, --typescript", "Create typescript feature files")
  .option("-g, --global", "Create feature in 'src/features' folder")
  .action(createFeature);

program.parse(process.argv);
