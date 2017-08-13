/* eslint-disable */
var webpack = require('webpack');

module.exports = {
    entry: {
        index: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
    },
    output: {
        path: path.resolve(dir, 'dist'),
        publicPath: '/dist/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
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
        modules: ['node_modules'],
        extensions: ['.js', '.jsx'],
    },
};
