/* eslint-disable import/unambiguous */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const createRules = require("./build/rules.js");
const { extensions, createAliases } = require("./build/resolve.js");

const NODE_ENV = process.env.NODE_ENV;

const defaultApiMode = "production";
const apiModes = ["production", "local-testing", "fake"];

const defaultPort = 3001;

module.exports = function createConfig(env) {
    const options = env || {};
    options.apiMode = options.apiMode || defaultApiMode;
    options.port = options.port || defaultPort;
    options.addIISWebConfig = Boolean(options.addIISWebConfig);
    options.baseUrl = options.baseUrl || "";

    if (!apiModes.includes(options.apiMode)) {
        throw new Error(`Please specify correct api mode --env.apiMode={${apiModes.join(",")}}`);
    }

    const result = {
        mode: NODE_ENV,
        entry: {
            index: ["@babel/polyfill", "whatwg-fetch", "./src/index"],
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: `${options.baseUrl}/`,
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
            require("autoprefixer"),
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
                "process.env.API_MODE": JSON.stringify(options.apiMode),
                "process.env.BASE_URL": JSON.stringify(options.baseUrl),
            }),
            new FaviconsWebpackPlugin({
                logo: './src/favicon.svg',
                cache: true,
                mode: 'webapp',
                devMode: 'webapp'
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
            historyApiFallback: {
                rewrites: [
                    { from: new RegExp(`^${escapeRegExp(options.baseUrl)}/`), to: `${options.baseUrl}/index.html` },
                ],
            },
        },
    };

    if (NODE_ENV === "development") {
        result.devtool = "source-map";
        result.entry.index = []
            .concat(["react-hot-loader/patch", `webpack-dev-server/client?http://localhost:${options.port}`])
            .concat(result.entry.index);

        result.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        );
        result.resolve.alias["react-dom"] = "@hot-loader/react-dom";
        result.devServer.hot = true;
    }

    if (NODE_ENV === "production") {
        result.output.filename = "[name].[hash].js";
        result.plugins.push(
            new MiniCssExtractPlugin({
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

    if (env && env.mode === "debug-build") {
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

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
