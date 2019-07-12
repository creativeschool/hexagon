const fs = require('fs')
const path = require('path')
const wrapper = require('fastify-plugin')
const chalk = require('chalk')

module.exports = wrapper(async (server, opts) => {
  fs.readdirSync(__dirname).filter(x => x.endsWith('.json')).forEach(name => {
    console.log(chalk.bgGreen.black('SCHEMA') + '\t' + chalk.underline(name))
    server.addSchema(require(path.join(__dirname, name)))
  })
})
