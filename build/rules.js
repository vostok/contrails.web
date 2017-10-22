/* eslint-disable import/unambiguous */
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function createRules(NODE_ENV) {
    const PROD = (NODE_ENV || "development") === "production";
    return [
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
                    use: ["classnames-loader"],
                },
                {
                    use: PROD
                        ? ExtractTextPlugin.extract([
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: true,
                                      localIdentName: "[hash:base64:6]",
                                  },
                              },
                              "postcss-loader",
                              "less-loader",
                          ])
                        : [
                              "style-loader",
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: true,
                                      localIdentName: "[name]-[local]--[hash:base64:3]",
                                  },
                              },
                              "postcss-loader",
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
                    use: PROD
                        ? ExtractTextPlugin.extract([
                              {
                                  loader: "css-loader",
                                  options: {
                                      localIdentName: "[hash:base64:6]",
                                  },
                              },
                          ])
                        : [
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
    ];
};
