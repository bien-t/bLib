const path = require('path')
const CURRENT_WORKING_DIR = process.cwd()
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          inject: true,
          template: 'server/index.html',
        }),
  ],
}

module.exports = config