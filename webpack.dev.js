const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        open: true,
        hot: true,
        publicPath: '/public',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
})

