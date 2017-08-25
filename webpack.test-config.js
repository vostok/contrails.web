/* eslint-disable import/unambiguous */
const path = require("path");

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                rules: [
                    {
                        use: [
                            "classnames-loader",
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    modules: true,
                                    localIdentName: "[name]-[local]--[hash:base64:3]",
                                },
                            },
                            "less-loader",
                        ],
                    },
                ],
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                rules: [
                    {
                        use: ["json-loader"],
                    },
                ],
            },
            {
                test: /\.css$/,
                include: /react-ui/,
                rules: [
                    {
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    localIdentName: "[name]-[local]--[hash:base64:3]",
                                },
                            },
                        ],
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                include: /react-ui/,
                use: ["file-loader"],
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                exclude: /node_modules/,
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            ui: path.join(__dirname, "./src/commons/ui"),
            commons: path.join(__dirname, "./src/commons"),
        },
    },
    externals: [nodeExternals()],
};
