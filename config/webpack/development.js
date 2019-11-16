// Note: You must restart bin/webpack-dev-server for changes to take effect

const { join } = require('path')
const { env } = require('process')
const merge = require('webpack-merge')
const sharedConfig = require('./base.config.js')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const webpack = require('webpack')

function removeOuterSlashes(string) {
  return string.replace(/^\/*/, '').replace(/\/*$/, '')
}

function formatPublicPath(host = '', path = '') {
  let formattedHost = removeOuterSlashes(host)
  if (formattedHost && !/^http/i.test(formattedHost)) {
    formattedHost = `//${formattedHost}`
  }
  const formattedPath = removeOuterSlashes(path)
  return `${formattedHost}/${formattedPath}/`
}

module.exports = merge(sharedConfig, {
   devtool: 'cheap-module-eval-source-map',

   devServer: {
      clientLogLevel: 'none',
      https: false,
      host: "0.0.0.0",
      port: "8080",
      contentBase: join(global.rootpath, 'public', ''),
      publicPath: formatPublicPath(env.ASSET_HOST, ''),
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: true,
      watchOptions: {
         ignored: /node_modules/
      }
   },

   mode: "development",

   module: {
      rules: [
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
      new LiveReloadPlugin({
         appendScriptTag: true
      }),
   ],

   stats: {
      errorDetails: true
   },
})
