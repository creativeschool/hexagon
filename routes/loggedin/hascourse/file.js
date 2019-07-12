const { ObjectId } = require('mongodb')
const { fileSync, fileNew, fileMove, fileMetaUpdate } = require('../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const files = server.db.collection('files')

  server.post('/sync', { schema: fileSync }, async (req) => {
    return files.find({ course: req.course, updated: { $gt: req.body.last } }).toArray()
  })

  const preCheck = async (req) => {
    if (!req.body.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
  }

  const fileScope = async (req) => {
    const _id = new ObjectId(req.headers['x-file-id'])
    const file = await files.findOne({ _id }, { _id: 0, course: 1, path: 1 })
    if (!file) throw server.httpErrors.notFound()
    if (!file.course.equals(req.course) || !file.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    return _id
  }

  server.post('/new', { schema: fileNew, preHandler: preCheck }, async (req) => {
    const now = new Date()
    const result = await files.insertOne({ course: req.course, path: req.body.path, tags: req.body.tags, created: now, updated: now, versions: {} })
    return result.insertedId
  })

  server.post('/move', { schema: fileMove, preHandler: preCheck }, async (req) => {
    await files.updateOne({ _id: await fileScope(req) }, { $set: { path: req.body.path }, $currentDate: { updated: true } })
    return true
  })

  server.post('/meta', { schema: fileMetaUpdate }, async (req) => {
    await files.updateOne({ _id: await fileScope(req) }, { $set: req.body, $currentDate: { updated: true } })
    return true
  })

  server.post('/version', async (req) => {
    //
  })
}