const { userUcmap } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const ucmap = server.ucmap

  server.post('/ucmap', { schema: userUcmap }, async req => {
    return ucmap.find({ user: req.user, updated: { $gt: req.body.last } }).toArray()
  })
}
