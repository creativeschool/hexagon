(async () => {
  const server = require('fastify')({ logger: true })
  await server
    .register(require('fastify-cors'))
    .register(require('fastify-sensible'))
    .register(require('./schemas/shared'))
    .register(require('./db'))
    .register(require('./routes'), { prefix: '/api' })
    .listen(3000)
  console.log(server.printRoutes())
})()
