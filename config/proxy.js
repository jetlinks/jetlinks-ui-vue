/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
module.exports = {
  dev: {
    '/jetlinks': {
      target: 'http://192.168.5.3:8848/',
      ws: 'http://192.168.5.3:8848/',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' }
    }
  },
  dev_aly: {
    '/jetlinks': {
      // target: 'http://192.168.3.89:8848/',
      target: 'http://101.133.174.173:8848/',
      ws: 'http://101.133.174.173:8848/',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' }
    }
  },
  pre: {
    '/jetlinks': {
      // target: 'http://192.168.3.89:8848/',
      target: 'http://2.jetlinks.org:9010/',
      changeOrigin: true,
      pathRewrite: { '^/jetlinks': '' }
    }
  }
}
