const { ObjectId } = require('mongodb')
const { fileSync, fileNew, fileUpdate, fileContent } = require('../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const files = server.files

  server.post('/sync', { schema: fileSync }, async (req) => {
    return files.find({ course: req.course, updated: { $gt: new Date(req.body.last) } }).toArray()
  })

  server.post('/new', { schema: fileNew }, async (req) => {
    if (!req.priv.scope || !req.body.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    req.body.course = req.course
    req.body.created = req.body.updated = new Date()
    const result = await files.insertOne(req.body)
    return result.insertedId
  })

  server.post('/update', { schema: fileUpdate }, async (req) => {
    if (!req.priv.scope || (req.body.path && !req.body.path.startsWith(req.priv.scope))) throw server.httpErrors.forbidden()
    const _id = new ObjectId(req.headers['x-file-id'])
    const file = await files.findOne({ _id }, { _id: 0, course: 1, path: 1 })
    if (!file) throw server.httpErrors.notFound()
    if (!file.course.equals(req.course) || !file.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    await files.updateOne({ _id }, { $set: req.body, $currentDate: { updated: true } })
    return true
  })

  server.get('/content', { schema: fileContent }, async (req) => {
    const i = parseInt(req.headers['x-file-version'])
    const _id = new ObjectId(req.headers['x-file-id'])
    const file = await files.findOne({ _id }, { _id: 0, course: 1, path: 1, versions: 1 })
    if (!file) throw server.httpErrors.notFound()
    if (!(i >= 0 && i < file.versions.length)) throw server.httpErrors.badRequest()
    if (!file.course.equals(req.course)) throw server.httpErrors.forbidden()
    const version = file.versions[i]
    if (!file.path.startsWith(req.priv.scope) && !version.name.startsWith(req.priv.allowver)) throw server.httpErrors.forbidden()
    return version.hash
  })

  // @todo Cannot sync problems. 7/14/2019
  // For the same reason, message cannot be remove too.
  // server.post('/remove', { schema: fileRemove }, async (req) => {
  //   await files.deleteOne({ _id: await fileScope(req) })
  //   return true
  // })
}
