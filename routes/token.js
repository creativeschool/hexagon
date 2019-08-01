const { tokenDetail } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.get('/detail', { tokenDetail }, async req => {
    const token = await tokens.findOne({ _id: req.headers['x-access-token'] })
    if (!token) throw server.httpErrors.forbidden()
    return token
  })
}
