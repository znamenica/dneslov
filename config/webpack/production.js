

/* eslint global-require: 0 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const sharedConfig = require('./base.config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(sharedConfig, {
   //output: { filename: '[name]-[chunkhash].js' },
   devtool: 'cheap-source-map',

   mode: "production",

   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
               options: {
                  cacheDirectory: true,
                  babelrc: false,
                  configFile: false,
                  compact: false,
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
                     "@babel/preset-react",
                  ],
                  plugins: [
                     [ "@babel/transform-runtime", { //automatically polyfilling but +30K
                        helpers: false,
                        regenerator: true,
                     }],
                     "@babel/plugin-syntax-dynamic-import",
                     [
                        "@babel/plugin-proposal-class-properties",
                        {
                           "spec": true
                        }
                     ],
                     [
                        "@babel/plugin-proposal-decorators",
                        {
                           "legacy": true,
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
                  ],
               },
            }]
         },
      ],
   },
   optimization: {
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
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
   },
   output: {
      pathinfo: false
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
   stats: 'normal',
})
