// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const sharedConfig = require('./base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(sharedConfig, {
   output: { filename: '[name]-[chunkhash].js' },
   devtool: 'cheap-source-map',
   stats: 'normal',

   plugins: [
      new webpack.DefinePlugin({
         'process.env': {
            'NODE_ENV': JSON.stringify('production')
         },
      }),

      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
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
            join_vars: true
            drop_debugger: true,
            drop_console: true, // strips console statements
            booleans: true,
         },

         output: {
            comments: false
         },

         exclude: [/\.min\.js$/gi]
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
      new CompressionPlugin({
         asset: '[path].gz[query]',
         algorithm: 'gzip',
         test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/,
         threshold: 10240,
         minRatio: 0
      })
   ]
})
