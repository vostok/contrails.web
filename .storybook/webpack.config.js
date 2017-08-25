const path = require("path");
const createRules = require("../build/rules.js");
const { extensions, createAliases } = require("../build/resolve.js");

module.exports = function(storybookBaseConfig, configType) {
    storybookBaseConfig.module.rules.push(...createRules());

    storybookBaseConfig.entry.preview = [
        require.resolve("babel-polyfill"),
        require.resolve("react-hot-loader/patch"),
        require.resolve("../src/styles/reset.less"),
        require.resolve("../src/styles/typography.less"),
        ...storybookBaseConfig.entry.preview,
    ];
    storybookBaseConfig.resolve.alias = Object.assign({}, storybookBaseConfig.resolve.alias, createAliases());
    return storybookBaseConfig;
};
