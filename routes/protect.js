/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const tokens = server.db.collection('tokens')

  server.addHook('preHandler', async (req) => {
    const token = await tokens.findOne({ _id: req.headers['x-access-token'] })
    if (!token) throw server.httpErrors.notFound()
    req._id = token.user
  })
  server.register(require('./user'), { prefix: '/user' })
  server.register(require('./course'), { prefix: '/course' })
}
