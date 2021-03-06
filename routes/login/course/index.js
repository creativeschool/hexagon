const { ObjectId } = require('mongodb')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const ucmap = server.ucmap

  server.addHook('preHandler', async req => {
    const mapper = await ucmap.findOne({ user: req.user, course: new ObjectId(req.body.courseId) })
    if (!mapper) throw server.httpErrors.forbidden()
    req.course = mapper.course
    req.priv = mapper.priv
  })

  server.register(require('./sync'))
  server.register(require('./ucmap'))
  server.register(require('./edit'))
  server.register(require('./file'), { prefix: '/file' })
  server.register(require('./msg'), { prefix: '/msg' })
}
