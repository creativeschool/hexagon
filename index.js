const server = require('fastify')()
  .register(require('fastify-cors'))
  .register(require('fastify-sensible'))
  .register(require('./schemas/shared'))
  .register(require('./db/mongo'))
  .register(require('./db/redis'))
  .register(require('./routes'), { prefix: '/api' })

if (require.main === module) {
  (async () => {
    const { version } = require('./package.json')
    await server.listen(3000, '::')
    console.log(`${require('chalk').blue('MAIN')}\t⬡ Hexagon ${version} ⬡ started`)
  })()
} else {
  module.exports = server
}
