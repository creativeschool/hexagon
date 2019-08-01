const { courseSync } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const courses = server.courses

  server.post('/sync', { schema: courseSync }, async req => {
    const course = await courses.findOne({ _id: req.course })
    if (!course) throw server.httpErrors.forbidden()
    return course
  })
}
