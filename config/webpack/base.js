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
      'application': [
         './app/assets/javascripts/application.js',
         './app/assets/stylesheets/application.scss'
      ],
      'application.admin': [
         './app/assets/javascripts/application.admin.js',
         './app/assets/stylesheets/application.admin.scss',
      ],
      'application.about': [
         './app/assets/javascripts/application.about.js',
         './app/assets/stylesheets/application.about.scss',
      ]
   },

   module: {
      // noParse: /lodash/, // ignore parsing for modules ex.lodash

      rules: [
         {
            test: /~$/,
            loader: 'ignore-loader'
         },
         {
            test: /\.(png|jpe?g|gif|svg|webp)$/,
            loaders: [
               'file?hash=sha512&digest=hex&name=[hash].[ext]',
               'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
         },
         {
            test: /\.s[ac]ss$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
               },
               { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
               "postcss-loader",
               {
                  loader: "sass-loader",
                  options: {
                     implementation: require("sass"),
                  },
               },
            ],
         },
         {
            test: /\.css$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
               },
               { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
               { loader: 'postcss-loader', options: {} },
            ],
         },
         {
            test: /\.(woff2?|ttf|eot)$/,
            use: [{
               loader: 'file-loader',
            }]
         },
      ],
   },

   output: {
      path: join(global.rootpath, 'app/assets/builds'),
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
               includePaths: [join(global.rootpath, 'public'), join(global.rootpath, 'node_modules')],
               outputStyle: DEBUG ? 'nested' : 'compressed'
            },
         },
         postcss: [
            require('postcss-import')(),
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
      extensions: [ '.js', '.jsx', '.css', '.scss' ],
      modules: ['components', 'node_modules'],
   },
}

module.exports = customConfig
