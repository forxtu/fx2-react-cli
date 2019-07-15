const fs = require("fs-extra");
const replace = require("replace");

// utils
const capitalize = require("../utils/capitalize");

// templates
const templates = require("../templates/templates");

let classComponent;
let typescript;
let newCompPath;
let nofolder;
let stylesheet;

module.exports = async function createComponent(component, cmd) {
  newCompPath = component;
  cmd.nofolder ? (nofolder = true) : (nofolder = false);
  cmd.typescript ? (typescript = true) : (typescript = false);
  cmd.classComponent ? (classComponent = true) : (classComponent = false);
  cmd.functionalComponent
    ? (functionalComponent = true)
    : (functionalComponent = false);
  cmd.functionalComponentTs
    ? (functionalComponentTs = true)
    : (functionalComponentTs = false);
  cmd.style ? (stylesheet = true) : (stylesheet = false);

  if (fs.existsSync("./src/components")) {
    newCompPath = `./src/components/${component}`;
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

  if (stylesheet) {
    imports.push(templates.imports.stylesheet);
  }

  let exported = [templates.exported.default];

  return imports.join("\n") + "\n" + body + "\n" + exported;
}

function writeFile(template, component) {
  let path = newCompPath;

  if (nofolder) {
    strArr = newCompPath.split("/");
    strArr.splice(strArr.length - 1, 1);
    path = strArr.join("/");
    console.log(path);
  }

  let comp = component.split("/");
  comp = comp[comp.length - 1];

  if (path) {
    path = capitalize(path) + "/" + capitalize(comp);
  } else {
    path = capitalize(comp);
  }

  if (stylesheet) {
    if (!fs.existsSync(`${path}.scss`)) {
      console.log("creating syles");
      fs.outputFileSync(`${path}.scss`, "");
      console.log(`Stylesheet ${comp} created at ${path}.scss`.cyan);
    } else {
      console.log(
        `Stylesheet ${comp} allready exists at ${path}.scss, choose another name if you want to create a new stylesheet`
          .red
      );
    }
  }

  const fileWithselectedExtension = typescript ? `${path}.tsx` : `${path}.js`;
  const indexWithselectedExtension = typescript
    ? `${capitalize(comp)}/index.ts`
    : `${capitalize(comp)}/index.js`;

  if (!fs.existsSync(fileWithselectedExtension)) {
    // generate component file
    fs.outputFile(fileWithselectedExtension, template, err => {
      if (err) throw err;
      replace({
        regex: ":name",
        replacement: capitalize(comp),
        paths: [fileWithselectedExtension],
        recursive: false,
        silent: true
      });
      console.log(
        `Component ${comp} created at ${fileWithselectedExtension}`.cyan
      );
    });

    // generate index file
    if (!nofolder) {
      fs.outputFile(indexWithselectedExtension, templates.index, err => {
        if (err) throw err;
        replace({
          regex: ":name",
          replacement: capitalize(comp),
          paths: [indexWithselectedExtension],
          recursive: false,
          silent: true
        });
        console.log(
          `index file for ${comp} component created at ${indexWithselectedExtension}`
            .cyan
        );
      });
    }
  } else {
    console.log(
      `Component ${comp} allready exists at ${fileWithselectedExtension}, choose another name if you want to create a new component`
        .red
    );
  }
}
