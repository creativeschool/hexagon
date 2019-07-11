(async () => {
  const server = require('fastify')({ logger: true })
  await server
    .register(require('./db'))
    .register(require('./routes'))
    .listen(3000)
  console.log(server.printRoutes())
})()
