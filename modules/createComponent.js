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

// Global path
const GLOBAL_DIR = "./src/components";

const initFlags = (
  classComponent,
  typescript,
  nofolder,
  global,
  functionalComponent,
  functionalComponentTs
) => ({
  classComponent,
  typescript,
  nofolder,
  global,
  functionalComponent,
  functionalComponentTs
});

module.exports = async function createComponent(component, cmd) {
  let compPath = component;

  // Get provided flags
  const flags = initFlags(
    cmd.classcomponent || false,
    cmd.typescript || false,
    cmd.nofolder || false,
    cmd.global || false,
    cmd.functionalComponent || false,
    cmd.functionalComponentTs || false
  );

  // If global flag provided - Set component path to global
  const { global } = flags;
  if (global) {
    compPath = await getGlobalPath(GLOBAL_DIR, component);
  }

  const template = await buildTemplate(flags);
  writeFile(template, component, compPath, flags);
};

const getTemplateImports = isClassComponent => {
  const { reactClass, react } = templates.imports;
  return isClassComponent ? [reactClass] : [react];
};

const getTemplateBody = (isClassComponent, classTemplate, funcTemplate) =>
  isClassComponent ? [classTemplate] : [funcTemplate].join("\n");

function buildTemplate({ classComponent, typescript }) {
  let imports;
  let body;

  const {
    classComponentTs: classTemplateTs,
    functionalComponentTs: funcTemplateTs,
    classComponent: classTemplate,
    functionalComponent: funcTemplate,
    imports: { propTypes },
    exported: { default: defaultExport }
  } = templates;

  if (typescript) {
    imports = getTemplateImports(classComponent);

    body = getTemplateBody(classComponent, classTemplateTs, funcTemplateTs);
  } else {
    imports = getTemplateImports(classComponent);
    imports.push(propTypes);

    body = getTemplateBody(classComponent, classTemplate, funcTemplate);
  }

  return `${imports.join("\n")}\n${body}\n${defaultExport}`;
}

const successMessage = (comp, fileWithSelectedExtension) => {
  console.log(
    success,
    `Component "${comp}" created at "${fileWithSelectedExtension}`.cyan
  );
};

const errorMessage = (comp, fileWithSelectedExtension) => {
  console.log(
    error,
    `Component "${comp}" already exists at "${fileWithSelectedExtension}", choose another name if you want to create a new component`
      .red
  );
};

const generateComponentFile = (
  template,
  capitalizedComp,
  fileWithSelectedExtension
) => {
  fs.outputFile(fileWithSelectedExtension, template, err => {
    if (err) throw err;
    replace({
      regex: ":name",
      replacement: capitalizedComp,
      paths: [fileWithSelectedExtension],
      recursive: false,
      silent: true
    });
  });
};

const generateIndexFile = (
  nofolder,
  capitalizedComp,
  indexWithSelectedExtension
) => {
  if (!nofolder) {
    fs.outputFile(indexWithSelectedExtension, templates.index, err => {
      if (err) throw err;
      replace({
        regex: ":name",
        replacement: capitalizedComp,
        paths: [indexWithSelectedExtension],
        recursive: false,
        silent: true
      });
    });
  }
};

const getCompFileWithSelectedExtension = (path, typescript) =>
  `${path}.${typescript ? "tsx" : "jsx"}`;

const getIndexFileWithSelectedExtension = (path, typescript) =>
  `${getNoFolderPath(path)}/index.${typescript ? "ts" : "js"}`;

const getCompPath = (path, capitalizedComp) =>
  path ? `${path}/${capitalizedComp}` : capitalizedComp;

const setComp = component => {
  const comp = component.split("/");
  return comp[comp.length - 1];
};

function writeFile(template, component, compPath, { typescript, nofolder }) {
  let path = compPath;
  let comp = setComp(component);
  const capitalizedComp = capitalize(comp);

  // If nofolder flag provided - set path to no folder
  if (nofolder) {
    path = getNoFolderPath(compPath);
  }
  path = getCompPath(path, capitalizedComp);

  const fileWithSelectedExtension = getCompFileWithSelectedExtension(
    path,
    typescript
  );
  const indexWithSelectedExtension = getIndexFileWithSelectedExtension(
    path,
    typescript
  );

  if (!fs.existsSync(fileWithSelectedExtension)) {
    generateComponentFile(template, capitalizedComp, fileWithSelectedExtension);
    generateIndexFile(nofolder, capitalizedComp, indexWithSelectedExtension);
    successMessage(comp, fileWithSelectedExtension);
  } else {
    errorMessage(comp, fileWithSelectedExtension);
  }
}
