const { pbkdf2Sync, randomBytes } = require('crypto')
const { userPassChange, userEdit } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.post('/pass', { schema: userPassChange }, async req => {
    const user = await users.findOne({ _id: req.user }, { _id: 0, hash: 1, salt: 1 })
    const hash = pbkdf2Sync(req.body.old, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()
    await users.updateOne({ _id: req.user }, { $set: { hash: pbkdf2Sync(req.body.new, user.salt, 1000, 64, 'sha512').toString('hex') } })
    await tokens.deleteMany({ user: req.user })
    const value = randomBytes(32).toString('hex')
    await tokens.insertOne({ value, user: req.user })
    return value
  })

  server.post('/edit', { schema: userEdit }, async req => {
    req.body.updated = +new Date()
    await users.updateOne({ _id: req.user }, { $set: req.body })
    return null
  })
}
