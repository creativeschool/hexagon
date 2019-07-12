const { ObjectId } = require('mongodb')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const userCourse = server.db.collection('user_course')

  server.addHook('preHandler', async (req) => {
    const mapper = await userCourse.findOne({ user: req.userId, course: new ObjectId(req.headers['x-course-id']) })
    if (!mapper) throw server.httpErrors.forbidden()
    req.course = mapper.course
    req.priv = mapper.priv
  })

  server.register(require('./file'), { prefix: '/file' })
}