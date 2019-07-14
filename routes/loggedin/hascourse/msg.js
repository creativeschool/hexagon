const { ObjectId } = require('mongodb')
const { msgSync, msgNew, msgUpdate } = require('../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const msgs = server.msgs

  server.post('/sync', { schema: msgSync }, async (req) => {
    return msgs.find({ course: req.course, updated: { $gt: new Date(req.body.last) } }).toArray()
  })

  server.post('/new', { schema: msgNew }, async (req) => {
    if (!req.priv.msg) throw server.httpErrors.forbidden()
    req.body.course = req.course
    req.body.user = req.user
    req.body.created = req.body.updated = new Date()
    const result = await msgs.insertOne(req.body)
    return result.insertedId
  })

  server.post('/update', { schema: msgUpdate }, async (req) => {
    if (!req.priv.msg) throw server.httpErrors.forbidden()
    const _id = new ObjectId(req.headers['x-msg-id'])
    const msg = await msgs.findOne({ _id }, { _id: 0, course: 1, user: 1 })
    if (!msg) throw server.httpErrors.notFound()
    if (!msg.course.equals(req.course) || (!msg.user.equals(req.user))) throw server.httpErrors.forbidden()
    await msgs.updateOne({ _id }, { $set: req.body, $currentDate: { updated: true } })
    return true
  })
}
