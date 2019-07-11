const { pbkdf2Sync, randomBytes } = require('crypto')
const { syncUser, changePass } = require('../schemas')

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

  server.post('/sync', { schema: syncUser }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: req._id } },
      { $lookup: { from: 'user_course', localField: 'course', foreignField: 'course', as: 'link' } },
      { $unwind: '$link' },
      { $group: { _id: '$link.user' } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $replaceRoot: { newRoot: '$user' } },
      { $match: { 'updated': { $gt: req.body.last } } }
    ]).toArray()
  })

  server.post('/pass', { schema: changePass }, async (req) => {
    const user = await users.findOne({ _id: req._id }, { _id: 0, hash: 1, salt: 1 })
    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw new Error('Wrong password')
    await users.updateOne({ _id: req._id }, { $set: { hash: pbkdf2Sync(req.body.newpass, user.salt, 1000, 64, 'sha512').toString('hex') } })
    await tokens.deleteMany({ user: req._id })
    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: req._id })
    return token
  })

  server.get('/list', async (req) => {
    return users.find().toArray()
  })
}
