const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devServer: {
      contentBase: './dist',
      hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Babylon project',
            inject: false,
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.css/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            }
        ]
    }
};