const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV);

module.exports = {
    entry: {
        index: [
            "react-hot-loader/patch",
            "webpack-dev-server/client?http://localhost:3000",
            "babel-polyfill",
            "./src/index.js",
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js",
    },
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
                        use: ["style-loader", "css-loader", "less-loader"],
                    },
                ],
            },
            {
                test: /\.css$/,
                include: /react-ui/,
                rules: [
                    {
                        use: ["style-loader", "css-loader"],
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                include: /react-ui/,
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            ui: path.join(__dirname, "./src/commons/ui"),
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    devServer: {
        allowedHosts: ["localhost", ".dev.kontur"],
        port: 3000,
        historyApiFallback: true,
        hot: true,
    },
};
