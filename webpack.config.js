const path = require("path");

module.exports = {
    entry: {
        index: ["babel-polyfill", "react-hot-loader/patch", "./src/index.js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
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
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
};
