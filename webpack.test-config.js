/* eslint-disable import/unambiguous */
const nodeExternals = require("webpack-node-externals");

const createRules = require("./build/rules.js");
const { extensions, createAliases } = require("./build/resolve.js");

module.exports = {
    module: {
        rules: createRules(),
    },
    resolve: {
        extensions: extensions,
        alias: createAliases(),
    },
    externals: [nodeExternals()],
};
