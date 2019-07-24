# fx2-react-cli 🐙

## Installation

To install package globally on your machine

    npm install -g fx2-react-cli

    or

    yarn global add fx2-react-cli

Also you can install package in your project

    npm install fx2-react-cli --save-dev

    or

    yarn add fx2-react-cli --dev

## Usage

    fx2 <command> <options> <path/name>

At the moment there are 3 commands which allows you to generate component, hook and feature:

**Commands**:

      gc <options> <component path/name>  Generate component
      gh <options> <hook path/name>       Generate hook
      gf <options> <feature path/name>    Generate feature folder structure (react-redux is required)

**Options**:

    Global:
    -h, --help            output usage information
    -v, --version         output the version number

    Component:
    -c, --classcomponent  Create class component
    -t, --typescript      Create typescript component file
    -n, --nofolder        Do not wrap component in folder (without index file)
    -g, --global          Create component in "src/components" folder

    Hook:
    -t, --typescript      Create typescript hook file
    -n, --nofolder        Do not wrap hook in "hooks" folder
    -g, --global          Create hook in "src/hooks" folder

    Feature:
    -t, --typescript      Create typescript feature files (ts, tsx)
    -g, --global          Create feature in "src/features" folder

## Overview

- **Default extension of the generated files**

      JavaScript

- **How to use package with TypeScript?**

  Use `-t` option

      fx2 gc -t "GreatComponent" ✔️
      fx2 gc "GreatComponent" -t ✔️

      Order of the options and name doesn't metter

  Example above will generate component with .tsx extension and different structure

- **How to generate element in nested folder?**

  Provide path in `<name/path>` field. Make sure that you are in the right folder in your terminal. If you don't use global `-g` option provided path will take that folder as start point.

      fx2 gc "components/elements/Header" ✔️

  Generated structure:

      path/of/terminal/components
                        └── elements
                            └─── Header
                                  ├── Header.js
                                  └── index.js

- **Are " " necessary in `name/path` field?**

  No. " " are optional

      fx2 gc components/elements/Header ✔️

  Component will be generated in `components/elements/Header` folder

- **Do I have to capitalize name of my component?**

  No. Component name will be capitalized automatically, but not it's parent folder.

      fx2 gc components/elements/header ✔️

  Example above will generate structure like this:

      components
          └── elements
              └─── header // this name will be lowercase
                    ├── Header.js
                    └── index.js

- **Can I name my hook however I want?**

  Not exactly, it has to be with use prefix (hook rules of react) or you will get an error.

      fx2 gh useMyGreatHook ✔️

      fx2 gh myGreatHook ❌

## TODO

- [x] Generate components
- [x] Generate hooks
- [x] Generate feature
- [ ] Refactor to make code better
- [ ] ❔

## License

[MIT](https://github.com/forxtu/fx2-react-cli/blob/master/LICENSE)
