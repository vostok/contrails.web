/* eslint-disable import/unambiguous */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const createRules = require("./build/rules.js");
const { extensions, createAliases } = require("./build/resolve.js");

const NODE_ENV = process.env.NODE_ENV;

const apiTargets = ["vostok", "logsearch"];

const defaultApiMode = "production";
const apiModes = ["production", "local-testing", "fake"];

const defaultPort = 3001;

module.exports = function createConfig(env) {
    const options = env || {};
    options.apiMode = options.apiMode || defaultApiMode;
    options.apiTarget = options.apiTarget;
    options.port = options.port || defaultPort;
    options.addIISWebConfig = Boolean(options.addIISWebConfig);

    if (!apiModes.includes(options.apiMode)) {
        throw new Error(`Please specify correct api mode --env.apiMode={${apiModes.join(",")}}`);
    }
    if (!apiTargets.includes(options.apiTarget)) {
        throw new Error(`Please specify correct target --env.apiTarget={${apiTargets.join(",")}}`);
    }

    const result = {
        entry: {
            index: ["babel-polyfill", "whatwg-fetch", "./src/index.js"],
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
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require(`./prebuild/${NODE_ENV}/vendor-manifest.json`),
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new AddAssetHtmlPlugin({
                filepath: path.resolve(__dirname, `./prebuild/${NODE_ENV}/*.js`),
                includeSourcemap: false,
            }),
            new AddAssetHtmlPlugin({
                filepath: path.resolve(__dirname, `./prebuild/${NODE_ENV}/*.css`),
                typeOfAsset: "css",
                includeSourcemap: false,
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
                "process.env.API_TARGET": JSON.stringify(options.apiTarget),
                "process.env.API_MODE": JSON.stringify(options.apiMode),
            }),
            new CopyWebpackPlugin(
                [
                    {
                        context: path.join(__dirname, "prebuild", NODE_ENV),
                        from: "*",
                    },
                ],
                {
                    ignore: ["vendor-manifest.json"],
                }
            ),
        ],
        devServer: {
            proxy: createApiProxy(options.apiTarget, options.apiMode),
            allowedHosts: ["localhost"],
            port: options.port,
            historyApiFallback: true,
        },
    };

    if (NODE_ENV === "development") {
        result.devtool = "eval-source-map";
        result.entry.index = []
            .concat(["react-hot-loader/patch", `webpack-dev-server/client?http://localhost:${options.port}`])
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
        result.plugins.push(new UglifyJSPlugin({ extractComments: true }));
        result.plugins.push(
            new ExtractTextPlugin({
                filename: "[name].[hash].css",
            })
        );
        if (options.addIISWebConfig) {
            result.plugins.push(
                new CopyWebpackPlugin([
                    {
                        from: "./build/testing.web.config",
                        to: "web.config",
                    },
                ])
            );
        }
    }

    if (env.mode === "debug-build") {
        result.plugins.push(new BundleAnalyzerPlugin());
    }

    return result;
};

function createApiProxy(apiTarget, apiMode) {
    if (apiMode === "local-testing") {
        if (apiTarget === "vostok") {
            return {
                "/api": {
                    target: "http://localhost:54266",
                    pathRewrite: { "^/api": "" },
                },
            };
        } else if (apiTarget === "logsearch") {
            return {
                "/api": {
                    target: "http://logsearchapi.dev.kontur:30002",
                    pathRewrite: { "^/api": "" },
                },
            };
        }
    }
    return {};
}
