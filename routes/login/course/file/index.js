const { ObjectId } = require('mongodb')
const { fileSync, fileNew, fileEdit, fileContent } = require('../../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const files = server.files
  /** @type {import('mongodb').GridFSBucket} */
  const fs = server.fs

  server.post('/sync', { schema: fileSync }, async (req) => {
    return files.find({ course: req.course, updated: { $gt: req.body.last } }).toArray()
  })

  server.post('/new', { schema: fileNew }, async (req) => {
    if (!req.priv.scope || !req.body.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    req.body.course = req.course
    req.body.created = req.body.updated = +new Date()
    const result = await files.insertOne(req.body)
    return result.insertedId
  })

  server.post('/edit', { schema: fileEdit }, async (req) => {
    if (!req.priv.scope || (req.body.path && !req.body.path.startsWith(req.priv.scope))) throw server.httpErrors.forbidden()
    const _id = new ObjectId(req.body.fileId)
    const file = await files.findOne({ _id, course: req.course }, { _id: 0, path: 1 })
    if (!file) throw server.httpErrors.forbidden()
    if (!file.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    req.body.updated = +new Date()
    await files.updateOne({ _id }, { $set: req.body })
    return null
  })

  server.get('/content', { schema: fileContent }, async (req) => {
    const i = req.body.versionId
    const _id = new ObjectId(req.body.fileId)
    const file = await files.findOne({ _id, course: req.course }, { _id: 0, path: 1, versions: 1 })
    if (!file) throw server.httpErrors.forbidden()
    if (!(i >= 0 && i < file.versions.length)) throw server.httpErrors.badRequest()
    const version = file.versions[i]
    if (!file.path.startsWith(req.priv.scope) && !version.name[0] === '!') throw server.httpErrors.forbidden()
    return fs.openDownloadStreamByName(version.hash)
  })

  // @todo Cannot sync problems. 7/14/2019
  // For the same reason, message cannot be remove too.
  // server.post('/remove', { schema: fileRemove }, async (req) => {
  //   await files.deleteOne({ _id: await fileScope(req) })
  //   return true
  // })
}
