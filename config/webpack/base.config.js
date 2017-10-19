/*
 * Webpack config with Babel, Sass and PostCSS support.
 */

var path = require('path');
var webpack = require('webpack')
var join = path.join
var ExtractTextPlugin = require('extract-text-webpack-plugin')

if (process.env.RAILS_ENV === undefined) {
   global.env = process.env.NODE_ENV || 'development'
} else {
   global.env = process.env.RAILS_ENV
}

var PROD = global.env === 'production'
var DEBUG = !PROD

if (__dirname.match(/config/)) {
   global.rootpath = path.normalize(join(__dirname, '../../'))
} else {
   global.rootpath = __dirname
}

console.log("Rails root:", global.rootpath)

const extractCSS = new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
const extractSCSS = new ExtractTextPlugin({ filename: '[name].scss', allChunks: true })
//const postcssOpts = {postcss: {plugins: [autoprefixer(autoprefixerOpts)], sourceMap: true}}
const postcssOpts = {sourceMap: true}

module.exports = {
  cache: true,

  context: global.rootpath,

  entry: {
    // JavaScript
    'javascripts/webpack/app': './app/webpack/js/app.js',

    // Stylesheets
    'stylesheets/webpack/app': './app/webpack/css/app.js',
  },

  output: {
    path: join(global.rootpath, 'vendor/assets'),
    filename: '[name].js',
    pathinfo: DEBUG ? true : false,
    devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
  },

   module: {
      loaders: [
         {
            test: /~$/,
            loader: 'ignore-loader'
         },
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
            test: /\.coffee$/,
            use: [{
               loader: 'coffee-loader',
            }]
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

   resolve: {
      extensions: [ '.js', '.jsx', '.coffee' ],
      alias: {
         libs: path.join(global.rootpath, 'libs')
      }
   },

  plugins: [
    // allChunks will preserve source maps
    new ExtractTextPlugin({ filename: '[name].css.erb', allChunks: true }),
    extractSCSS,
    extractCSS,

    // Ignore locales because it's around 400kb
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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
        require('postcss-asset-url-rails')()
      ],
    }),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
  ],
}
