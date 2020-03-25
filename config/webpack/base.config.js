/*
 * Webpack config with Babel, Sass and PostCSS support.
 */

global.env = process.env.RAILS_ENV || process.env.NODE_ENV || 'development'

const path = require('path');
const join = path.join
var PROD = global.env === 'production'
var DEBUG = !PROD

if (__dirname.match(/config/)) {
   global.rootpath = path.normalize(join(__dirname, '../../'))
} else {
   global.rootpath = __dirname
}

console.log("Env:", global.env)
console.log("Root:", global.rootpath)

var webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssOpts = {sourceMap: true}

module.exports = {
   cache: true,

   context: global.rootpath,

   entry: {
      //'babel-polyfill': 'babel-polyfill/lib/index.js',
      //'react-hot-loader/patch', // hot reloading react components
      // JavaScript
      'javascripts/app': './app/webpack/js/app.js',
      'javascripts/admin': './app/webpack/js/admin.js',
      'javascripts/about': './app/webpack/js/about.js',
      // Stylesheets
      'stylesheets/app': './app/webpack/css/app.js',
      'stylesheets/admin': './app/webpack/css/admin.js',
      'stylesheets/about': './app/webpack/css/about.js',
   },

   module: {
      // noParse: /lodash/, // ignore parsing for modules ex.lodash

      rules: [
         {
            test: /~$/,
            loader: 'ignore-loader'
         },
         {
            test: /\.(sa|sc|c)ss$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     // you can specify a publicPath here
                     // by default it uses publicPath in webpackOptions.output
                     // publicPath: '../',
                     hmr: DEBUG,
                     reloadAll: true,
                  },
               },
               'css-loader',
               'postcss-loader',
               'sass-loader',
            ],
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/,
            loaders: [
               'file?hash=sha512&digest=hex&name=[hash].[ext]',
               'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
         },
         {
            test: /\.(woff|woff2|ttf|eot)$/,
            use: [{
               loader: 'file-loader',
            }]
         },
      ],
   },

   output: {
      path: join(global.rootpath, 'vendor/assets'),
      filename: '[name].js',
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
   },

   resolve: {
      extensions: [ '.js', '.jsx' ],
      modules: ['components','node_modules'],
      alias: {
         components: path.join(global.rootpath, 'app/webpack/js/components')
      }
   },

   plugins: [
      new webpack.ProvidePlugin({
         React: 'react',
         M: 'materialize-css'
      }),
      new MiniCssExtractPlugin({ filename: '[name].css',
                                 chunkFilename: '[id].css',
                                 ignoreOrder: DEBUG ? false : true }),

      // Ignore locales because it's around 400kb
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.LoaderOptionsPlugin({
         test: /\.xxx$/, // may apply this only for some modules
         debug: DEBUG ? true : false,
         options: {
            sassLoader: {
               includePaths: join(global.rootpath, 'node_modules'),
               outputStyle: DEBUG ? 'nested' : 'compressed'
            },
         },
         postcss: [
            require('autoprefixer')(),
         ],
      }),
   ],
}
