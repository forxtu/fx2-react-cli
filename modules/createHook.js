const fs = require("fs-extra");
const replace = require("replace");
const camelCase = require("lodash/camelCase");

// Utils
const { pascalCase } = require("../utils/helpers");
const { getNoFolderPath, getGlobalPath } = require("../utils/selectors");
const {
  consoleMessages: { success, error }
} = require("../utils/common");

// Templates
const template = require("../templates/templates");

let global;
let typescript;
let newHookPath;

module.exports = async function createHook(hook, cmd) {
  newHookPath = hook;

  cmd.nofolder ? (nofolder = true) : (nofolder = false);
  cmd.typescript ? (typescript = true) : (typescript = false);
  cmd.global ? (global = true) : (global = false);

  // Global path
  const globalDir = "./src/hooks";

  if (global) {
    newHookPath = await getGlobalPath(globalDir, hook);
  }

  const template = await buildTemplate();
  writeFile(template, hook);
};

function buildTemplate() {
  const imports = [template.imports.hook];
  const body = [template.hook].join("\n");
  const exported = [template.exported.default];

  return imports.join("\n") + "\n" + body + "\n" + exported;
}

function writeFile(template, hook) {
  let path = newHookPath;

  let hookName = hook.split("/");
  const hookNameLength = hookName.length;
  hookName = hookNameLength > 1 ? hookName[hookName.length - 1] : hookName[0];

  const formattedHookName = camelCase(hookName);

  if (nofolder) {
    path = getNoFolderPath(newHookPath);
  }

  let hookNamePath;

  if (global) {
    path = newHookPath;
  } else {
    hookNamePath = hookNameLength > 1 ? getNoFolderPath(newHookPath) : "./";
  }

  if (path) {
    if (!global) {
      path = `${hookNamePath}${
        !nofolder ? "/hooks/" : "/"
      }${formattedHookName}`;
    }
  } else {
    path = formattedHookName;
  }

  const isHookNamesPrefixUse = hookName.substring(0, 3) === "use";

  const fileWithSelectedExtension = typescript ? `${path}.ts` : `${path}.js`;

  if (!fs.existsSync(fileWithSelectedExtension)) {
    isHookNamesPrefixUse
      ? fs.outputFile(fileWithSelectedExtension, template, (err) => {
          if (err) throw err;
          replace({
            regex: ":name",
            replacement: formattedHookName,
            paths: [fileWithSelectedExtension],
            recursive: false,
            silent: true
          });
          console.log(
            success,
            `Hook "${hookName}" created at "${fileWithSelectedExtension}"`.cyan
          );
        })
      : console.log(
          error,
          `Hook must have a "use" in its prefix. Try to generate "use${pascalCase(
            hookName
          )}"`.red
        );
  } else {
    console.log(
      error,
      `Hook "${hookName}" already exists at "${fileWithSelectedExtension}", choose another name if you want to create a new hook`
        .red
    );
  }
}
