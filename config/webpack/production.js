process.env.NODE_ENV = process.env.RAILS_ENV || 'production'

const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const sharedConfig = require('./base')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const customConfig = merge(sharedConfig, {
   devtool: 'cheap-source-map',

   mode: "production",

   optimization: {
      concatenateModules: true,
      minimize: true,
      removeAvailableModules: true,
      mangleWasmImports: true,
      splitChunks: {
         chunks: 'async',
         minSize: 30000,
         maxSize: 0,
         minChunks: 1,
         maxAsyncRequests: 5,
         maxInitialRequests: 3,
         automaticNameDelimiter: '~',
         automaticNameMaxLength: 30,
         name: true,
         cacheGroups: {
            vendors: {
               test: /[\\/]node_modules[\\/]/,
               priority: -10
            },
            default: {
               minChunks: 2,
               priority: -20,
               reuseExistingChunk: true
            }
         }
      },
      minimizer: [
         new TerserPlugin({
            parallel: true,
            terserOptions: {
               compress: {
                  pure_funcs: [
                     'console.log',
                     'console.debug',
                  ],
               },
               mangle: {
                  reserved: [
                     'console.log',
                     'console.debug',
                  ],
               },
               format: {
                  comments: false,
               },
               minify: TerserPlugin.uglifyJsMinify,
            },
            extractComments: false,
         }),
         new OptimizeCSSAssetsPlugin({}),
      ],
   },

   output: {
      pathinfo: false
   },

   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
               options: {
                  babelrc: false,
                  configFile: false,
                  compact: true,
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
                           "useBuiltIns": "usage"
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

   plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
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

   stats: {
      // Config for minimal console.log mess.
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
   }
})

console.log(customConfig)
module.exports = customConfig
