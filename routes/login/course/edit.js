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
    const delta = {
      meta: req.body.meta,
      updated: +new Date()
    }
    await courses.updateOne({ _id: req.course }, { $set: delta })
    return null
  })
}
