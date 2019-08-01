const { courseUcmap } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const ucmap = server.ucmap

  server.post('/ucmap', { schema: courseUcmap }, async req => {
    return ucmap.find({ course: req.course, updated: { $gt: req.body.last } }).toArray()
  })
}
