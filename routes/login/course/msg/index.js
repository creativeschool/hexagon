const { ObjectId } = require('mongodb')
const { msgSync, msgNew, msgEdit } = require('../../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const msgs = server.msgs

  server.post('/sync', { schema: msgSync }, async (req) => {
    return msgs.find({ course: req.course, updated: { $gt: req.body.last } }).toArray()
  })

  server.post('/new', { schema: msgNew }, async (req) => {
    if (!req.priv.msg) throw server.httpErrors.forbidden()
    req.body.course = req.course
    req.body.user = req.user
    req.body.created = req.body.updated = +new Date()
    const result = await msgs.insertOne(req.body)
    return result.insertedId
  })

  server.post('/edit', { schema: msgEdit }, async (req) => {
    if (!req.priv.msg) throw server.httpErrors.forbidden()
    const _id = new ObjectId(req.body.msgId)
    const msg = await msgs.findOne({ _id, course: req.course, user: req.user }, { _id: 0 })
    if (!msg) throw server.httpErrors.forbidden()
    req.body.updated = +new Date()
    await msgs.updateOne({ _id }, { $set: req.body })
    return null
  })
}
