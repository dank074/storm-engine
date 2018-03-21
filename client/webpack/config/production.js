// Webpack config for creating the production bundle.
const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const paths = require('../paths')

const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  context: paths.appDir,
  entry: './src/client.js',
  output: {
    path: paths.appPublicDist,
    library: 'StormEngine',
    filename: '[chunkhash].js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/dist/'
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      }
    ]
  },
  resolve: {
    alias: {
      config: paths.resolveAppConfig
    },
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([paths.appPublicDist], { root: paths.appDir }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash].css',
      // disable: false,
      allChunks: true
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'storm-engine',
      filename: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 8388608,

      // Ensure all our static, local assets are cached.
      staticFileGlobs: [path.dirname(paths.appPublic) + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
      stripPrefix: path.dirname(paths.appPublic),

      directoryIndex: '/',
      verbose: true,
      navigateFallback: '/dist/index.html',
      runtimeCaching: [{
        urlPattern: /\/api\/widget\/load(.*)/,
        handler: 'networkFirst',
        options: {
          debug: true
        }
      }]
    })
  ]
}
