'use strict'

const app = require('express')()
const webpack = require('webpack')

const config = require('./config/development')
const paths = require('./paths')

const { host, port } = paths.appPackageJson.devConfig
const compiler = webpack(config)

const serverOptions = {
  contentBase: `http://${host}:${port}`,//path.join(__dirname, '..', 'dist'),
  compress: true,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  historyApiFallback: true
}

app.use(require('webpack-dev-middleware')(compiler, serverOptions))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port)
  }
})
