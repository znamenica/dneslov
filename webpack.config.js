/*
 * Webpack config with Babel, Sass and PostCSS support.
 */

var webpack = require('webpack')
var join = require('path').join
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var LiveReloadPlugin = require('webpack-livereload-plugin')

var PROD = process.env.NODE_ENV === 'production'
var DEBUG = !PROD

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const extractCSS = new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
const extractSCSS = new ExtractTextPlugin({ filename: '[name].scss', allChunks: true })
//const postcssOpts = {postcss: {plugins: [autoprefixer(autoprefixerOpts)], sourceMap: true}}
const postcssOpts = {sourceMap: true}

module.exports = {
  cache: true,

  context: __dirname,

  entry: {
    // JavaScript
    'javascripts/webpack/app': './app/webpack/js/app.js',

    // Stylesheets
    'stylesheets/webpack/app': './app/webpack/css/app.js',
  },

  output: {
    path: join(__dirname, 'vendor/assets'),
    filename: '[name].js',
    pathinfo: DEBUG ? true : false,
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
      },
      {
        test: /\.scss$/,
        //loader: DEBUG
        //  ? ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader?-url&sourceMap&importLoaders=1!postcss-loader?sourceMap=inline!sass-loader?sourceMap'})
        loader : extractSCSS.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', 'sass-loader' ]
        })
      },
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: [{
          loader: 'file-loader',
        }]
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    // allChunks will preserve source maps
    new ExtractTextPlugin({ filename: '[name].css.erb', allChunks: true }),
    extractSCSS,
    extractCSS,

    new UglifyJsPlugin({
      sourceMap: true
    }),
    // Ignore locales because it's around 400kb
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.LoaderOptionsPlugin({
      test: /\.xxx$/, // may apply this only for some modules
      debug: DEBUG ? true : false,
      options: {
        sassLoader: {
          includePaths: join(__dirname, 'node_modules'),
          outputStyle: DEBUG ? 'nested' : 'compressed'
        },
      },
      postcss: [
        require('autoprefixer')(),
        require('postcss-asset-url-rails')()
      ],
    })
  ].concat(DEBUG ? [
    new LiveReloadPlugin({ appendScriptTag: true }),
  ] : []),

  // Best trade-off with compatibility and speed
  devtool: DEBUG ? 'cheap-module-eval-source-map' : undefined,
}
