const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const listJson = require('./src/js/data/list.json')
const links = {
    absoluteURL: 'http://localhost:3000',
    github: 'https://github.com/zehfernandes/worldcup2019-posters',
    mailto:
        'mailto:ozehfernandes@gmail.com?subject=I want a world cup posters ☝️&body=(send an email if you are interested in buying and soon I will answer you with price and print options.)'
}

module.exports = {
    mode: 'development',
    entry: {
        canvas: './src/js/canvas.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] },
            files: ['./dist/*']
        }),
        new HtmlWebpackPlugin({
            links: links,
            filename: 'single.html',
            template: 'src/single.hbs',
            minify: {
                minifyCSS: true,
                collapseWhitespace: true
            },
            chunks: ['canvas']
        }),
        new HtmlWebpackPlugin({
            links: links,
            data: listJson,
            filename: 'index.html',
            template: 'src/index.hbs',
            inject: false,
            minify: {
                minifyCSS: true,
                collapseWhitespace: true
            }
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/css/tachyons.min.css',
                to: __dirname + '/dist/css/tachyons.min.css',
                toType: 'file'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/images/',
                to: __dirname + '/dist/images/'
            }
        ])
    ],
    watch: true,
    devtool: 'source-map'
}
