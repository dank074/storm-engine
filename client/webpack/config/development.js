'use strict'

// Webpack config for development
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
//const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

const paths = require('../paths')
const helpers = require('../helpers')
const { host, port } = paths.appPackageJson.devConfig
const publicPath = `http://${host}:${port}/dist/`

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const babelrc = fs.readFileSync(paths.appBabelrc)
let babelrcObject = {}

try {
  babelrcObject = JSON.parse(babelrc)
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.')
  console.error(err)
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {}

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || []
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins)

var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment, { plugins: combinedPlugins })
delete babelLoaderQuery.env

var validDLLs = helpers.isValidDLLs('vendor', path.appPublicDist)
if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0'
  console.warn('webpack dlls disabled')
}

const webpackConfig = module.exports = {
  devtool: 'inline-source-map',
  context: paths.appDir,
  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
    './src/index.js',
    //require.resolve('react-error-overlay')
  ],
  output: {
    path: path.appPublicDist,
    library: 'StormEngine',
    filename: 'storm-engine-client.js',
    chunkFilename: '[chunkhash].js',
    publicPath
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'happypack/loader?id=js',
        include: [paths.appSrc, paths.appFurni]
      }, {
        test: /\.json$/,
        loader: 'happypack/loader?id=json',
        //include: [path.resolve(__dirname, '..')]
      }
    ]
  },
  externals: {
    "react": 'React',
    "react-dom": 'ReactDOM',
    "pixi.js": 'PIXI'
  },
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.tsx', '.ts']
  },
  plugins: [
    // hot reload
    new CheckerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.NamedModulesPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    helpers.createHappyPlugin('js', [
      {
        loader: 'react-hot-loader/webpack'
      }, {
        loader: 'babel-loader',
        options: babelLoaderQuery
      }
    ]),
    helpers.createHappyPlugin('json', [
      { loader: 'json-loader' }
    ])
  ]
}

if (process.env.WEBPACK_DLLS && validDLLs) {
  helpers.installVendorDLL(webpackConfig, 'vendor')
}
