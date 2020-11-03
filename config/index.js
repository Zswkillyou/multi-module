'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const multiConfig = require('./multi.conf')//引入多模块配置

module.exports = {
  dev: {

    // Paths  
    assetsSubDirectory: multiConfig.process.assetsSubDirectory, //static
    assetsPublicPath: multiConfig.process.assetsPublicPath, // 路径 /
    proxyTable: null,

    // Various Dev Server settings
    // ip 端口  host: 'localhost', port: 8080,
    host: multiConfig.process.host, // can be overwritten by process.env.HOST
    port: multiConfig.process.port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    // ./dist/index.html
    index:  multiConfig.process.index,

    // Paths
    assetsRoot: multiConfig.process.assetsRoot, //打包dist文件下
    assetsSubDirectory: multiConfig.process.assetsSubDirectory,//静态文件static
    assetsPublicPath: multiConfig.process.buildassetsPublicPath,//打包路径修改成./

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
