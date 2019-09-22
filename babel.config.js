module.exports = {
    plugins: ["lodash"],
    overrides: [
        {
            test: ["**/*.ts", "**/*.tsx"],
            presets: [
                "@babel/preset-typescript",
                "@babel/preset-react",
                [
                    "@babel/preset-env",
                    {
                        modules: false
                    }
                ],
            ],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }]
            ],
            env: {
                test: {
                    sourceMaps: 'both',
                    presets: [['@babel/env', { targets: { node: '10.0.0' } }]],
                },
            },
        },
        {
            test: ["**/*.js", "**/*.jsx"],
            presets: [
                "@babel/preset-flow",
                "@babel/preset-react",
                [
                    "@babel/preset-env",
                    {
                        modules: false
                    }
                ],
            ],
            plugins: ["@babel/plugin-proposal-class-properties"],
            env: {
                test: {
                    sourceMaps: 'both',
                    presets: [['@babel/env', { targets: { node: '10.0.0' } }]],
                },
            },
        }
    ],
    env: {
        development: {
            plugins: ["react-hot-loader/babel"]
        },
    }
};
