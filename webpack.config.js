/* eslint-disable import/unambiguous */
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const createRules = require("./build/rules.js");
const { extensions, createAliases } = require("./build/resolve.js");

const NODE_ENV = process.env.NODE_ENV;

module.exports = function createConfig(env) {
    const options = env || {};
    options.api = options.api || "real";

    const result = {
        entry: {
            index: ["babel-polyfill", "./src/index.js"],
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "/",
            filename: "[name].js",
        },
        module: {
            rules: createRules(NODE_ENV),
        },
        resolve: {
            extensions: extensions,
            alias: createAliases(),
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
                "process.env.API": JSON.stringify(options.api),
            }),
        ],
        devServer: {
            proxy: {
                "/api": {
                    target: "http://logsearchapi.dev.kontur:30002",
                    pathRewrite: { "^/api": "" },
                },
            },
            allowedHosts: ["localhost"],
            port: 3000,
            historyApiFallback: true,
        },
    };

    if (NODE_ENV === "development") {
        result.devtool = "eval-source-map";
        result.entry.index = []
            .concat(["react-hot-loader/patch", "webpack-dev-server/client?http://localhost:3000"])
            .concat(result.entry.index);

        result.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        );
        result.devServer.hot = true;
    }

    if (NODE_ENV === "production") {
        result.output.filename = "[name].[hash].js";
        // TODO отключить при конечном выпуске в продакшен
        result.devtool = "source-map";
        result.plugins.push(
            new UglifyJSPlugin(true, { comments: false }),
            new CopyWebpackPlugin([
                {
                    from: "./build/testing.web.config",
                    to: "web.config",
                },
            ])
        );
    }

    return result;
};
