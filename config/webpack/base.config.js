/*
 * Webpack config with Babel, Sass and PostCSS support.
 */

var path = require('path');
var join = path.join

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

var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
const extractSCSS = new ExtractTextPlugin({ filename: '[name].scss', allChunks: true })
//const postcssOpts = {postcss: {plugins: [autoprefixer(autoprefixerOpts)], sourceMap: true}}
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
      //'stylesheets/webpack/app': './app/webpack/css/app.js',
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
      // allChunks will preserve source maps
      new ExtractTextPlugin({ filename: '[name].css.erb', allChunks: true }),
      extractSCSS,
      extractCSS,

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
            require('postcss-asset-url-rails')()
         ],
      }),
      new webpack.ProvidePlugin({
         React: 'react',
      }),
   ],
}
