const fs = require("fs-extra");
const replace = require("replace");

// utils
const { capitalize } = require("../utils/helpers");
const { getElementName, getGlobalPath } = require("../utils/selectors");
const {
  consoleMessages: { success, error }
} = require("../utils/common");

let newFeaturePath;
let global;
let typescript;

module.exports = async function createFeature(feature, cmd) {
  newFeaturePath = feature;

  cmd.global ? (global = true) : (global = false);
  cmd.typescript ? (typescript = true) : (typescript = false);

  // Global path
  const globalDir = "./src/features";

  if (global) {
    newFeaturePath = await getGlobalPath(globalDir, feature);
  }

  generateBoilerplate(newFeaturePath);
};

function generateBoilerplate(path) {
  const featureName = getElementName(path);

  if (!fs.existsSync(path)) {
    processFeatureElements(path, featureName);

    console.log(success, `Feature "${featureName}" created at "${path}"`.cyan);
  } else {
    console.log(
      error,
      `Feature "${featureName}" already exists at "${path}", choose another name if you want to create a new feature`
        .red
    );
  }
}

function processFeatureElements(path, featureName) {
  const featureElements = [
    { type: "components", name: "FeatureComponent", suffix: "" },
    { type: "containers", name: "FeatureContainer", suffix: "Container" },
    { type: "actions", name: "FeatureActions", suffix: "Actions" },
    { type: "reducers", name: "FeatureReducer", suffix: "Reducer" },
    { type: "types", name: "FeatureTypes", suffix: "Types" },
    { type: "hooks", name: "useFeature", suffix: "" }
  ];

  const capitalizedFeatureName = capitalize(featureName);

  const getTypescriptExtension = () => (typescript ? "ts" : "js");
  const getTypescriptExtensionTsx = () => (typescript ? "tsx" : "js");
  const getTypescriptExtensionWithType = element => {
    return typescript
      ? element.type === "components" || element.type === "containers"
        ? "tsx"
        : "ts"
      : "js";
  };

  const getDefaultPath = element => {
    return `${path}/${element.type}/${
      element.name
    }.${getTypescriptExtensionWithType(element)}`;
  };

  // Step 1 - copy files from templates
  fs.copySync(
    `${require("path").dirname(
      require.main.filename
    )}/templates/feature/${getTypescriptExtension()}`,
    `${path}`
  );

  const renameIfPathExists = process => {
    fs.pathExists(
      `${path}/components/FeatureComponent.${getTypescriptExtensionTsx()}`,
      (err, exists) => {
        if (exists) {
          process();
        }
        if (err) {
          console.log(error, `Something went wrong ${err}`.red);
        }
      }
    );
  };

  const processData = () => {
    featureElements.forEach(element => {
      fs.renameSync(
        getDefaultPath(element),
        `${path}/${element.type}/${
          element.type === "hooks"
            ? `use${capitalizedFeatureName}`
            : capitalizedFeatureName
        }${capitalize(element.suffix)}.${getTypescriptExtensionWithType(
          element
        )}`,
        err => {
          console.log(error, `Something went wrong ${err}`.red);
        }
      );
    });

    replace({
      regex: "__NAME_PLACEHOLDER__",
      replacement: capitalizedFeatureName,
      paths: [path],
      recursive: true,
      silent: true
    });
  };

  // Step 2 - rename files and replace :name
  renameIfPathExists(processData);
}
