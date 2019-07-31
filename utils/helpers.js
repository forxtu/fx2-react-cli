const { upperFirst, camelCase } = require("lodash");

function capitalize(text) {
  return upperFirst(text);
}

function pascalCase(text) {
  return upperFirst(camelCase(text));
}

module.exports = {
  capitalize,
  pascalCase
};
