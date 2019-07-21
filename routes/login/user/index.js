/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  server.register(require('./sync'))
  server.register(require('./edit'))
  server.register(require('./ucmap'))
}
