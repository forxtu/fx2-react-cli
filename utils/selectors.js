const fs = require("fs-extra");

const getNoFolderPath = newPath => {
  strArr = newPath.split("/");
  strArr.splice(strArr.length - 1, 1);
  path = strArr.join("/");
  return path;
};

const getElementName = path => {
  let elementName = path.split("/");
  elementName = elementName[elementName.length - 1];
  return elementName;
};

const getGlobalPath = async (directory, element) => {
  try {
    await fs.ensureDirSync(directory);

    return `${directory}/${element}`;
  } catch (err) {
    console.error(`Something went wrong ${err}`.bgRed.black);
  }
};

module.exports = {
  getNoFolderPath,
  getElementName,
  getGlobalPath
};
