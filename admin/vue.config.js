const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['mongodb']
    }
  }
}
