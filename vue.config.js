const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8087,   // 端口号
  }
}
