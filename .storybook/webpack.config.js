const path = require("path");

module.exports = function(storybookBaseConfig, configType) {
    storybookBaseConfig.module.rules.push({
        test: /\.css$/,
        include: /react-ui/,
        rules: [
            {
                use: ["style-loader", "css-loader"],
            },
        ],
    });
    storybookBaseConfig.module.rules.push({
        test: /\.json$/,
        exclude: /node_modules/,
        rules: [
            {
                use: ["json-loader"],
            },
        ],
    });
    storybookBaseConfig.module.rules.push({
        test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
        include: /react-ui/,
        use: ["file-loader"],
    });
    storybookBaseConfig.module.rules.push({
        test: /\.(svg|png)$/,
        exclude: /node_modules/,
        use: ["file-loader"],
    });
    storybookBaseConfig.module.rules.push({
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
    }), (storybookBaseConfig.entry.preview = [
        require.resolve("babel-polyfill"),
        require.resolve("react-hot-loader/patch"),
        require.resolve("../src/styles/reset.less"),
        require.resolve("../src/styles/typography.less"),
        ...storybookBaseConfig.entry.preview,
    ]);
    storybookBaseConfig.resolve.alias = storybookBaseConfig.resolve.alias || {};
    storybookBaseConfig.resolve.alias.ui = path.join(__dirname, "../src/commons/ui");
    return storybookBaseConfig;
};
