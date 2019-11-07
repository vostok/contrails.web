/* eslint-disable import/unambiguous */
const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const createRules = require("./build/rules.js");
const { extensions } = require("./build/resolve.js");

function createConfigForEnvironment(environment) {
    const PROD = environment === "production";

    const result = {
        mode: environment,
        entry: {
            vendor: [
                "@babel/polyfill",
                "whatwg-fetch",
                "react",
                "react-dom",
                "react-helmet",
                "react-draggable",
                "react-router-dom",
                "react-router",
                "prop-types",
                "redux",
                "redux-thunk",
                "decimal.js",
                "./src/Commons/ui/index",
                "moment",
                "memoizee",
            ],
        },
        output: {
            path: path.join(__dirname, "prebuild", environment),
            publicPath: "",
            filename: PROD ? "[name].[hash].js" : "[name].js",
            library: "vendor",
        },
        module: {
            rules: createRules(environment),
        },
        resolve: {
            extensions: extensions,
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new webpack.DllPlugin({
                name: "vendor",
                path: `prebuild/${environment}/vendor-manifest.json`,
            }),
            new webpack.DefinePlugin({}),
            new MiniCssExtractPlugin({
                filename: "[name].[hash].css",
            }),
        ],
    };

    return result;
}

module.exports = [createConfigForEnvironment("production"), createConfigForEnvironment("development")];
