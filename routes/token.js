const { tokenDetail } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.get('/detail', { tokenDetail }, async req => {
    const value = req.headers['x-access-token']
    if (!value) throw server.httpErrors.forbidden()
    const token = await tokens.findOne({ value })
    if (!token) throw server.httpErrors.forbidden()
    return token
  })
}
