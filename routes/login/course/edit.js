const { courseMetaEdit } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const courses = server.courses

  server.post('/meta', { schema: courseMetaEdit }, async req => {
    if (!req.priv.meta) throw server.httpErrors.forbidden()
    await courses.updateOne({ _id: req.course }, { $set: { meta: req.body.meta } })
    return null
  })
}
