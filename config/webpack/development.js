// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const sharedConfig = require('./base.config.js')
const { settings, output } = require('./configuration.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const webpack = require('webpack')

module.exports = merge(sharedConfig, {
   devtool: 'cheap-module-eval-source-map',

   devServer: {
      clientLogLevel: 'none',
      https: settings.dev_server.https,
      host: settings.dev_server.host,
      port: settings.dev_server.port,
      contentBase: output.path,
      publicPath: output.publicPath,
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: true,
      watchOptions: {
         ignored: /node_modules/
      }
   },

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
                        polyfill: false,
                        regenerator: true,
                     }],
                     "syntax-dynamic-import",
                     [
                        "transform-class-properties", // +0.1K
                        {
                           "spec": true
                        }
                     ],
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

   output: {
      pathinfo: true
   },

   plugins: [
      new UglifyJsPlugin({
         sourceMap: true
      }),
      new LiveReloadPlugin({
         appendScriptTag: true
      }),
   ],

   stats: {
      errorDetails: true
   },
})
