const { ObjectId } = require('mongodb')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { fileSync, fileNew, fileEdit, fileContent } = require('../../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const files = server.files
  /** @type {import('redis').RedisClient} */
  const redis = server.redis
  const getAsync = promisify(redis.get).bind(redis)
  const setAsync = promisify(redis.set).bind(redis)

  server.post('/sync', { schema: fileSync }, async req => {
    return files.find({ course: req.course, updated: { $gt: req.body.last } }).toArray()
  })

  server.post('/new', { schema: fileNew }, async req => {
    if (!req.priv.scope || !req.body.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    req.body.course = req.course
    req.body.created = req.body.updated = +new Date()
    const result = await files.insertOne(req.body)
    return result.insertedId
  })

  server.post('/edit', { schema: fileEdit }, async req => {
    if (!req.priv.scope || (req.body.path && !req.body.path.startsWith(req.priv.scope))) throw server.httpErrors.forbidden()
    const _id = new ObjectId(req.body.fileId)
    const file = await files.findOne({ _id, course: req.course }, { _id: 0, path: 1 })
    if (!file) throw server.httpErrors.forbidden()
    if (!file.path.startsWith(req.priv.scope)) throw server.httpErrors.forbidden()
    req.body.updated = +new Date()
    await files.updateOne({ _id }, { $set: req.body })
    return null
  })

  server.post('/content', { schema: fileContent }, async req => {
    const i = req.body.versionId
    const _id = new ObjectId(req.body.fileId)
    const file = await files.findOne({ _id, course: req.course }, { _id: 0, path: 1, versions: 1 })
    if (!file) throw server.httpErrors.forbidden()
    if (!(i >= 0 && i < file.versions.length)) throw server.httpErrors.badRequest()
    const version = file.versions[i]
    if (!file.path.startsWith(req.priv.scope) && !version.name[0] === '!') throw server.httpErrors.forbidden()
    let token = await getAsync(version.hash)
    if (!token) {
      token = randomBytes(32).toString('hex')
      await setAsync(version.hash, token, 'EX', 24 * 60 * 60) // Hash cache expires in 1 day
      await setAsync(token, version.hash, 'EX', 48 * 60 * 60) // Token cache expires in 2 day
    }
    return token
  })
}
