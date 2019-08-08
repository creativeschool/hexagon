/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.addHook('preHandler', async req => {
    const value = req.headers['x-access-token']
    if (!value) throw server.httpErrors.forbidden()
    const token = await tokens.findOne({ value })
    if (!token) throw server.httpErrors.forbidden()
    req.user = token.user
  })
  server.register(require('./user'), { prefix: '/user' })
  server.register(require('./course'), { prefix: '/course' })
  server.register(require('./content'), { prefix: '/content' })
  server.register(require('./notice'), { prefix: '/notice' })
  server.register(require('./time'), { prefix: '/time' })
}
