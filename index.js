(async () => {
  const { version } = require('./package.json')
  const server = require('fastify')()
  await server
    .register(require('fastify-cors'))
    .register(require('fastify-sensible'))
    .register(require('./schemas/shared'))
    .register(require('./db'))
    .register(require('./routes'), { prefix: '/api' })
    .listen(3000)
  console.log(`${require('chalk').blue('MAIN')}\t⬡ Hexagon ${version} ⬡ started`)
})()
