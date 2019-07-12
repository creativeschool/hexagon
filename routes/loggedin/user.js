const { pbkdf2Sync, randomBytes } = require('crypto')
const { userSync, userPassChange, userProfChange } = require('../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.db.collection('users')
  /** @type {import('mongodb').Collection} */
  const tokens = server.db.collection('tokens')
  /** @type {import('mongodb').Collection} */
  const userCourse = server.db.collection('user_course')

  server.post('/sync', { schema: userSync }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: req.userId } },
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
    const user = await users.findOne({ _id: req.userId }, { _id: 0, hash: 1, salt: 1 })
    const hash = pbkdf2Sync(req.body.old, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()
    await users.updateOne({ _id: req.userId }, { $set: { hash: pbkdf2Sync(req.body.new, user.salt, 1000, 64, 'sha512').toString('hex') } })
    await tokens.deleteMany({ user: req.userId })
    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: req.userId })
    return token
  })

  server.post('/prof', { schema: userProfChange }, async (req) => {
    await users.updateOne({ _id: req.userId }, { $set: req.body, $currentDate: { updated: true } })
    return true
  })

  server.get('/list', async (req) => {
    return users.find().toArray()
  })
}
