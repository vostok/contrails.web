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
        test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
        include: /react-ui/,
        use: ["file-loader"],
    });
    storybookBaseConfig.entry.preview = [
        require.resolve("babel-polyfill"),
        require.resolve("react-hot-loader/patch"),
        ...storybookBaseConfig.entry.preview,
    ];
    return storybookBaseConfig;
};
