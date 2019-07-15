const { pbkdf2Sync, randomBytes } = require('crypto')
const { userSync, userPassChange, userUpdate } = require('../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens
  /** @type {import('mongodb').Collection} */
  const userCourse = server.userCourse

  server.post('/sync', { schema: userSync }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: req.user } },
      { $lookup: { from: 'user_course', localField: 'course', foreignField: 'course', as: 'link' } },
      { $unwind: '$link' },
      { $group: { _id: '$link.user' } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $match: { 'user.updated': { $gt: req.body.last } } },
      { $replaceRoot: { newRoot: '$user' } }
    ]).toArray()
  })

  server.post('/pass', { schema: userPassChange }, async (req) => {
    const user = await users.findOne({ _id: req.user }, { _id: 0, hash: 1, salt: 1 })
    const hash = pbkdf2Sync(req.body.old, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()
    await users.updateOne({ _id: req.user }, { $set: { hash: pbkdf2Sync(req.body.new, user.salt, 1000, 64, 'sha512').toString('hex') } })
    await tokens.deleteMany({ user: req.user })
    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: req.user })
    return token
  })

  server.post('/update', { schema: userUpdate }, async (req) => {
    req.body.updated = +new Date()
    await users.updateOne({ _id: req.user }, { $set: req.body })
    return true
  })
}
