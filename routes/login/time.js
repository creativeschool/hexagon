/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  server.get('/current', async req => {
    return +new Date()
  })
}
