const fs = require("fs-extra");
const replace = require("replace");
const camelCase = require("lodash/camelCase");

// utils
const { pascalCase } = require("../utils/common");
const getNoFolderPath = require("../utils/selectors");

// templates
const template = require("../templates/templates");

module.exports = async function createHook(hook, cmd) {
  newHookPath = hook;

  cmd.nofolder ? (nofolder = true) : (nofolder = false);
  cmd.typescript ? (typescript = true) : (typescript = false);

  if (fs.existsSync("./src/hooks")) {
    newHookPath = `./src/hooks/${hook}`;
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
  hookName = hookName[hookName.length - 1];

  const formattedHookName = camelCase(hookName);

  if (nofolder) {
    path = getNoFolderPath(newHookPath);
  }

  if (path) {
    path = `${getNoFolderPath(newHookPath)}${
      !nofolder ? "/hooks/" : "/"
    }${formattedHookName}`;
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
            `Hook ${hookName} created at ${fileWithselectedExtension}`.cyan
          );
        })
      : console.log(
          `Hook must have a "use" in its prefix. Try to generate "use${pascalCase(
            hookName
          )}"`.red
        );
  } else {
    console.log(
      `Hook ${hookName} allready exists at ${fileWithselectedExtension}, choose another name if you want to create a new hook`
        .red
    );
  }
}
