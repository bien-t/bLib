const path = require('path')
const webpack = require('webpack')
const CURRENT_WORKING_DIR = process.cwd()
const HtmlWebpackPlugin = require('html-webpack-plugin');


const config = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
        ]
    },  
    plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            template: 'server/index.html',
          }),
    ],
    resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom'
        }
    }
}

module.exports = config