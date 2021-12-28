const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { join, normalize } = require('path')
const webpack = require('webpack')
const PROD = global.env === 'production' || global.env === 'staging'
const DEBUG = !PROD

global.rootpath = normalize(join(__dirname, '../../'))

const customConfig = {
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
            test: /\.(png|jpe?g|gif|svg)$/,
            loaders: [
               'file?hash=sha512&digest=hex&name=[hash].[ext]',
               'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
         },
         {
            test: /\.(sa|sc)ss$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     hmr: DEBUG,
                     reloadAll: true,
                  },
               },
               { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
               { loader: 'postcss-loader', options: { options: {}, } },
               { loader: 'sass-loader', options: { sourceMap: true } },
            ],
         },
         {
            test: /\.css$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     hmr: DEBUG,
                     reloadAll: true,
                  },
               },
               { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
               { loader: 'postcss-loader', options: { options: {}, } },
            ],
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

   resolve: {
      // configuration options
      alias: {
         React: 'react',
         ReactDOM: 'react-dom',
      },
      extensions: [ '.js', '.jsx', 'css', 'scss' ],
      modules: ['components', 'node_modules'],
   },
}

module.exports = customConfig
