const path = require("path");
const createRules = require("../build/rules.js");
const { extensions, createAliases } = require("../build/resolve.js");

module.exports = function({ config }) {
    config.entry = [
        require.resolve("../src/Style/Reset.less"),
        require.resolve("../src/Style/Typography.less"),
        ...config.entry,
    ];
    config.module.rules = createRules();
    config.resolve.extensions = [...config.resolve.extensions, ...extensions];
    config.resolve.alias = Object.assign({}, config.resolve.alias, createAliases());
    return config;
};
