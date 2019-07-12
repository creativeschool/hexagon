(async () => {
  const server = require('fastify')({ logger: true })
  await server
    .register(require('fastify-sensible'))
    .register(require('./schemas/shared'))
    .register(require('./db'))
    .register(require('./routes'))
    .listen(3000)
})()
