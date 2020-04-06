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
                  babelrc: false,
                  configFile: false,
                  compact: false,
                  cacheDirectory: true,
                  ignore: [ /cjs/, /node_modules/ ],
                  presets: [
                     [
                        "@babel/preset-env",
                        {
                           "modules": false,
                           "targets": {
                              "browsers": "> 1%",
                              "uglify": true
                           },
                           "useBuiltIns": false
                        },
                     ],
                     [
                        "@babel/preset-react",
                        {
                           runtime: "classic"
                        }
                     ]
                  ],
                  plugins: [
                     [ "@babel/transform-runtime", { //automatically polyfilling but +30K
                        helpers: false,
                        regenerator: true,
                     }],
                     [
                        "@babel/plugin-proposal-decorators",
                        {
                           "legacy": true,
                        }
                     ],
                     [
                        "@babel/plugin-proposal-class-properties",
                        {
                           "spec": true
                        }
                     ],
                     '@babel/plugin-proposal-logical-assignment-operators',
                     '@babel/plugin-syntax-dynamic-import',
                     '@babel/plugin-transform-react-jsx-source',
                     '@babel/plugin-transform-react-jsx-self',
                     '@babel/plugin-transform-react-constant-elements',
                     '@babel/plugin-transform-react-inline-elements',
                     '@babel/plugin-transform-destructuring',
                     '@babel/plugin-transform-async-to-generator',
                     'transform-react-pure-class-to-function',
                     'transform-es3-modules-literals',
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
         appendScriptTag: true,
         protocol: 'http'
      }),
   ],

   stats: {
      errorDetails: true
   },
})
