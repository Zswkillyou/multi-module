'use strict'
const os = require('os')//多模块添加的
const fs = require('fs')//多模块添加的
const path = require('path')//多模块添加的
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const pack = require('../package.json')//多模块添加的
const merge = require('webpack-merge')
const chalk = require('chalk')//多模块添加的
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const multiConfig = require('../config/multi.conf')//引入多模块配置文件

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//多模块配置
function getIPAdress () {
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
//多模块配置
function isExists (path) {
  try {
    fs.statSync(path)
    return true
  } catch (e) {
    return false
  }
}
//多模块配置
function porxyStatic () {
  return {
    '/static': {
      target: `http://${config.dev.host}:${config.dev.port}`,
      bypass: function (req, res, proxyOptions) {
        if (req.path.indexOf(`/${config.dev.assetsSubDirectory}/`) === 0) {
          let publics = multiConfig.process.publics
          for (let len = publics.length - 1; len >= 0; len--) {
            let pubPath = req.path.replace(`/${config.dev.assetsSubDirectory}/`, `/${config.dev.assetsSubDirectory}/${publics[len]}/`)
            if (isExists(path.resolve(__dirname, `../${pubPath}`))) {
              return pubPath
            }
          }
          return req.path
        }
      }
    }
  }
}

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: Object.assign(porxyStatic(), config.dev.proxyTable, multiConfig.process.proxyTable), //多模块配置
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin//多模块配置修改 IP地址配置
      let host = ['localhost', '127.0.0.1', '0.0.0.0'].includes(devWebpackConfig.devServer.host) ? 'localhost' : devWebpackConfig.devServer.host
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          // messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          messages: [chalk`{bold.rgb(255,255,0) [${pack.name} => ${multiConfig.process.name}]} App running at:\n - Local:   {bold.cyan http://${host}:${port}${config.dev.assetsPublicPath}}\n - Network: {bold.cyan http://${getIPAdress()}:${port}${config.dev.assetsPublicPath}}`]
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
