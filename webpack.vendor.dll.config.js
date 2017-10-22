/* eslint-disable import/unambiguous */
const path = require("path");

const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const createRules = require("./build/rules.js");
const { extensions } = require("./build/resolve.js");

function createConfigForEnvironment(environment) {
    const PROD = environment === "production";

    const result = {
        entry: {
            vendor: [
                "babel-polyfill",
                "whatwg-fetch",
                "react",
                "react-dom",
                "react-helmet",
                "react-draggable",
                "react-router-dom",
                "react-router",
                "decimal.js",
                "@skbkontur/react-ui/Button",
                "@skbkontur/react-ui/Icon",
                "@skbkontur/react-ui/Input",
                "@skbkontur/react-ui/Spinner",
                "moment",
            ],
        },
        output: {
            path: path.join(__dirname, "prebuild", environment),
            publicPath: "/",
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
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(environment),
            }),
            new ExtractTextPlugin({
                filename: "[name].[hash].css",
            }),
        ],
    };

    if (PROD) {
        result.plugins = result.plugins || [];
        result.plugins.push(new UglifyJSPlugin({ extractComments: true }));
    }

    return result;
}

module.exports = [createConfigForEnvironment("production"), createConfigForEnvironment("development")];
