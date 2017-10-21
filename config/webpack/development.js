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
