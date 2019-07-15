module.exports = getNoFolderPath = newPath => {
  strArr = newPath.split("/");
  strArr.splice(strArr.length - 1, 1);
  path = strArr.join("/");
  return path;
};
