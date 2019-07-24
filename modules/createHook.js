const fs = require("fs-extra");
const replace = require("replace");
const camelCase = require("lodash/camelCase");

// utils
const { pascalCase } = require("../utils/common");
const { getNoFolderPath, getGlobalPath } = require("../utils/selectors");

// templates
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

  const fileWithselectedExtension = typescript ? `${path}.ts` : `${path}.js`;

  if (!fs.existsSync(fileWithselectedExtension)) {
    isHookNamesPrefixUse
      ? fs.outputFile(fileWithselectedExtension, template, err => {
          if (err) throw err;
          replace({
            regex: ":name",
            replacement: formattedHookName,
            paths: [fileWithselectedExtension],
            recursive: false,
            silent: true
          });
          console.log(
            `✔️  Hook "${hookName}" created at "${fileWithselectedExtension}"`
              .cyan
          );
        })
      : console.log(
          `❌  Hook must have a "use" in its prefix. Try to generate "use${pascalCase(
            hookName
          )}"`.red
        );
  } else {
    console.log(
      `❌  Hook "${hookName}" allready exists at "${fileWithselectedExtension}", choose another name if you want to create a new hook`
        .red
    );
  }
}
