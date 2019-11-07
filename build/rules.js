const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function createRules(NODE_ENV) {
    const PROD = (NODE_ENV || "development") === "production";
    return [
        {
            test: /\.(jsx?|tsx?)$/,
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
                        ? [
                              MiniCssExtractPlugin.loader,
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: {
                                          localIdentName: "[hash:base64:8]",
                                      },
                                  },
                              },
                              "postcss-loader",
                              "less-loader",
                          ]
                        : [
                              "style-loader",
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: {
                                          localIdentName: "[name]-[local]--[hash:base64:3]",
                                      },
                                  },
                              },
                              "postcss-loader",
                              "less-loader",
                          ],
                },
            ],
        },
        {
            test: /\.css$/,
            include: /react-ui|react-icons/,
            rules: [
                {
                    use: PROD
                        ? [
                              MiniCssExtractPlugin.loader,
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: {
                                          localIdentName: "[hash:base64:8]",
                                      },
                                  },
                              },
                          ]
                        : [
                              "style-loader",
                              {
                                  loader: "css-loader",
                                  options: {
                                      modules: {
                                          localIdentName: "[name]-[local]--[hash:base64:3]",
                                      },
                                  },
                              },
                          ],
                },
            ],
        },
        {
            test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
            include: /react-ui|react-icons/,
            use: ["file-loader"],
        },
        {
            test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
            exclude: /node_modules/,
            use: ["file-loader"],
        },
    ];
};
