/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.addHook('preHandler', async req => {
    const header = req.headers['x-access-token']
    if (!header) throw server.httpErrors.forbidden()
    const token = await tokens.findOne({ _id: header })
    if (!token) throw server.httpErrors.forbidden()
    req.user = token.user
  })
  server.register(require('./user'), { prefix: '/user' })
  server.register(require('./course'), { prefix: '/course' })
  server.register(require('./content'), { prefix: '/content' })
}
