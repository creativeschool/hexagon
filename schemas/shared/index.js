const fs = require('fs')
const path = require('path')
const wrapper = require('fastify-plugin')

module.exports = wrapper(async (server, opts) => {
  fs.readdirSync(__dirname).filter(x => x.endsWith('.json')).forEach(name => {
    server.addSchema(require(path.join(__dirname, name)))
  })
})
