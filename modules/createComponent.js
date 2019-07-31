const fs = require("fs-extra");
const replace = require("replace");

// utils
const { capitalize } = require("../utils/helpers");
const { getNoFolderPath, getGlobalPath } = require("../utils/selectors");
const {
  consoleMessages: { success, error }
} = require("../utils/common");

// templates
const templates = require("../templates/templates");

let classComponent;
let typescript;
let newCompPath;
let nofolder;
let global;

module.exports = async function createComponent(component, cmd) {
  newCompPath = component;
  cmd.nofolder ? (nofolder = true) : (nofolder = false);
  cmd.global ? (global = true) : (global = false);
  cmd.typescript ? (typescript = true) : (typescript = false);
  cmd.classcomponent ? (classComponent = true) : (classComponent = false);
  cmd.functionalComponent
    ? (functionalComponent = true)
    : (functionalComponent = false);
  cmd.functionalComponentTs
    ? (functionalComponentTs = true)
    : (functionalComponentTs = false);

  // Global path
  const globalDir = "./src/components";

  if (global) {
    newCompPath = await getGlobalPath(globalDir, component);
  }

  let template = await buildTemplate();
  writeFile(template, component);
};

function buildTemplate() {
  let imports;
  typescript
    ? (imports = [templates.imports.reactTs])
    : classComponent
    ? (imports = [templates.imports.reactClass])
    : (imports = [templates.imports.react]);

  let body;

  if (!typescript) {
    imports.push(templates.imports.propTypes);

    body = classComponent
      ? [templates.classComponent]
      : [templates.functionalComponent].join("\n");
  } else {
    body = classComponent
      ? [templates.classComponentTs]
      : [templates.functionalComponentTs].join("\n");
  }

  let exported = [templates.exported.default];

  return imports.join("\n") + "\n" + body + "\n" + exported;
}

function writeFile(template, component) {
  let path = newCompPath;

  if (nofolder) {
    path = getNoFolderPath(newCompPath);
  }

  let comp = component.split("/");
  comp = comp[comp.length - 1];

  const capitalizedComp = capitalize(comp);

  if (path) {
    path = path + "/" + capitalizedComp;
  } else {
    path = capitalizedComp;
  }

  const fileWithselectedExtension = typescript ? `${path}.tsx` : `${path}.js`;
  const indexWithselectedExtension = typescript
    ? `${getNoFolderPath(path)}/index.ts`
    : `${getNoFolderPath(path)}/index.js`;

  if (!fs.existsSync(fileWithselectedExtension)) {
    // generate component file
    fs.outputFile(fileWithselectedExtension, template, err => {
      if (err) throw err;
      replace({
        regex: ":name",
        replacement: capitalizedComp,
        paths: [fileWithselectedExtension],
        recursive: false,
        silent: true
      });
      console.log(
        success,
        `Component "${comp}" created at "${fileWithselectedExtension}`.cyan
      );
    });

    // generate index file
    if (!nofolder) {
      fs.outputFile(indexWithselectedExtension, templates.index, err => {
        if (err) throw err;
        replace({
          regex: ":name",
          replacement: capitalizedComp,
          paths: [indexWithselectedExtension],
          recursive: false,
          silent: true
        });
      });
    }
  } else {
    console.log(
      error,
      `Component "${comp}" already exists at "${fileWithselectedExtension}", choose another name if you want to create a new component`
        .red
    );
  }
}
