process.env.NODE_ENV = 'development'

const { join } = require('path')
const { env } = require('process')
const { merge } = require('webpack-merge')
const sharedConfig = require('./base')
const webpack = require('webpack')

const customConfig = merge(sharedConfig, {
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

   stats: {
      errorDetails: true,
      children: true
   },
})

module.exports = customConfig
