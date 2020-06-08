const fs = require("fs-extra");
const replace = require("replace");
const path = require("path");

// utils
const { capitalize } = require("../utils/helpers");
const { getElementName, getGlobalPath } = require("../utils/selectors");
const {
  consoleMessages: { success, error }
} = require("../utils/common");

// Global path
const GLOBAL_DIR = "./src/features";

function processFeatureElements(featurePath, featureName, flags) {
  const { typescript } = flags;

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
  const getTypescriptExtensionWithType = (element) => {
    return typescript
      ? element.type === "components" || element.type === "containers"
        ? "tsx"
        : "ts"
      : "js";
  };

  const getDefaultPath = (element) => {
    return `${featurePath}/${element.type}/${
      element.name
    }.${getTypescriptExtensionWithType(element)}`;
  };

  // Step 1 - copy files from templates
  fs.copySync(
    `${path.dirname(
      require.main.filename
    )}/templates/feature/${getTypescriptExtension()}`,
    `${featurePath}`
  );

  const renameIfPathExists = (process) => {
    fs.pathExists(
      `${featurePath}/components/FeatureComponent.${getTypescriptExtensionTsx()}`,
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
    featureElements.forEach((element) => {
      fs.renameSync(
        getDefaultPath(element),
        `${featurePath}/${element.type}/${
          element.type === "hooks"
            ? `use${capitalizedFeatureName}`
            : capitalizedFeatureName
        }${capitalize(element.suffix)}.${getTypescriptExtensionWithType(
          element
        )}`,
        (err) => {
          console.log(error, `Something went wrong ${err}`.red);
        }
      );
    });

    replace({
      regex: "__NAME_PLACEHOLDER__",
      replacement: capitalizedFeatureName,
      paths: [featurePath],
      recursive: true,
      silent: true
    });
  };

  // Step 2 - rename files and replace :name
  renameIfPathExists(processData);
}

function generateBoilerplate(featurePath, flags) {
  const featureName = getElementName(featurePath);

  if (!fs.existsSync(featurePath)) {
    processFeatureElements(featurePath, featureName, flags);

    console.log(
      success,
      `Feature "${featureName}" created at "${featurePath}"`.cyan
    );
  } else {
    console.log(
      error,
      `Feature "${featureName}" already exists at "${featurePath}", choose another name if you want to create a new feature`
        .red
    );
  }
}

const initFlags = (global, typescript) => ({
  global,
  typescript
});

module.exports = async function createFeature(feature, cmd) {
  let featurePath = feature;

  // Get provided flags
  const flags = initFlags(cmd.global || false, cmd.typescript || false);

  // If global flag provided - Set feature path to global
  const { global } = flags;
  if (global) {
    featurePath = await getGlobalPath(GLOBAL_DIR, feature);
  }

  generateBoilerplate(featurePath, flags);
};
