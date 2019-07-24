const fs = require("fs-extra");
const replace = require("replace");

// utils
const { capitalize } = require("../utils/common");
const {
  getNoFolderPath,
  getElementName,
  getGlobalPath
} = require("../utils/selectors");

// templates
const templates = require("../templates/templates");

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

    console.log(`✔️  Feature "${featureName}" created at "${path}"`.cyan);
  } else {
    console.log(
      `❌  Feature "${featureName}" already exists at "${path}", choose another name if you want to create a new feature`
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

  const getTypescriptExtenstion = () => (typescript ? "ts" : "js");
  const getTypescriptExtenstionTsx = () => (typescript ? "tsx" : "js");
  const getTypescriptExtenstionWithType = element => {
    return typescript
      ? element.type === "components" || element.type === "containers"
        ? "tsx"
        : "ts"
      : "js";
  };

  const getDefaultPath = element => {
    return `${path}/${element.type}/${
      element.name
    }.${getTypescriptExtenstionWithType(element)}`;
  };

  // Step 1 - copy files from templates
  fs.copySync(
    `${require("path").dirname(
      require.main.filename
    )}/templates/feature/${getTypescriptExtenstion()}`,
    `${path}`
  );

  const renameIfPathExists = process => {
    fs.pathExists(
      `${path}/components/FeatureComponent.${getTypescriptExtenstionTsx()}`,
      (err, exists) => {
        if (exists) {
          process();
        }
        if (err) {
          console.log(`❌  Something went wrong ${err}`.red);
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
        }${capitalize(element.suffix)}.${getTypescriptExtenstionWithType(
          element
        )}`,
        err => {
          console.log(`❌  Something went wrong ${err}`.red);
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
