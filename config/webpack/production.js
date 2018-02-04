// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const sharedConfig = require('./base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(sharedConfig, {
   //output: { filename: '[name]-[chunkhash].js' },
   devtool: 'cheap-source-map',
   stats: 'normal',

   output: {
      pathinfo: false
   },

   plugins: [
      new webpack.DefinePlugin({
         'process.env': {
            'NODE_ENV': JSON.stringify('production')
         },
      }),

      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
         minimize: true,
         sourceMap: true,
         mangle: true,

         compress: {
            warnings: false,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
            drop_debugger: true,
            drop_console: false, // strips console statements NOTE disabled to allow popup remove minimodals in admin
            booleans: true,
         },

         output: {
            comments: false
         },

         exclude: [/\.min\.js$/gi]
      }),

      //new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
      new CompressionPlugin({
         asset: '[path].gz[query]',
         algorithm: 'gzip',
         test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/,
         threshold: 10240,
         minRatio: 0.4
      }),
      new BundleAnalyzerPlugin({
         analyzerMode: process.env.LOCAL ? 'static' : 'disabled',
      }),
   ],
   module: {
      loaders: [
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
               options: {
                  cacheDirectory: true,
                  ignore: /cjs/,
                  presets: [
                     [
                        "env",
                        {
                           "modules": false,
                           "targets": {
                              "browsers": "> 1%",
                              "uglify": true
                           },
                           "useBuiltIns": true
                        },
                     ],
                     //"es2015",
                     "stage-0",
                     "stage-2",
                     "react",
                  ],
                  plugins: [
                     [ "transform-runtime", { //automatically polyfilling but +30K
                        helpers: false,
                        polyfill: true,
                        regenerator: true,
                     }],
                     "syntax-dynamic-import",
                     [
                        "transform-class-properties", // +0.1K
                        {
                           "spec": true
                        }
                     ],
                     "transform-react-remove-prop-types",//didnt pillout the import of PropTypes
                     "transform-react-constant-elements",//+0.01K
                     "transform-react-inline-elements", //+0.5K
                     "transform-react-pure-class-to-function", //+0*/
                     'transform-es2015-destructuring',
                     'transform-object-rest-spread',
                     'transform-async-to-generator',
                     'transform-es3-modules-literals',
                     'transform-decorators-legacy',
                  ],
               },
            }]
         },
      ],
   },

   /*module: {
      loaders: [
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
               options: {
                  cacheDirectory: true,
                  ignore: /cjs/,
                  presets: [
                     [
                        "env",
                        {
                           "modules": false,
                           "targets": {
                              "browsers": "> 1%",
                              "uglify": true
                           },
                           "useBuiltIns": true
                        },
                     ],
                     "es2015",
                     "stage-0",
                     "react",
                  ],
                  plugins: [
                     //"transform-runtime",//automatically polyfilling but +30K
                     "syntax-dynamic-import",
                     [
                        "transform-class-properties", // +0.1K
                        {
                           "spec": true
                        }
                     ],
                     "transform-react-remove-prop-types",//didnt pillout the import of PropTypes
                     //"transform-react-constant-elements",//+0.01K
                     //"transform-react-inline-elements", //+0.5K
                     "transform-react-pure-class-to-function", //+0
                  ],
               },
            }]
         },
      ],
   },*/
})
