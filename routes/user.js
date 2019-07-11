const { pbkdf2Sync } = require('crypto')
const { ObjectID } = require('mongodb')
const { syncUser, changePass } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance<Server, IncomingMessage, ServerResponse>} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.db.collection('users')
  /** @type {import('mongodb').Collection} */
  const tokens = server.db.collection('tokens')

  server.post('/sync', { schema: syncUser }, async (req) => {
    return users.find({
      _id: { $in: req.body.ids.map(x => new ObjectID(x)) },
      updated: { $gt: req.body.last }
    }).toArray()
  })

  server.post('/pass', { schema: changePass }, async (req) => {
    const _id = new ObjectID(req.body.id)
    const user = await users.findOne({ _id })
    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw new Error('Wrong password')
    await users.updateOne({ _id }, { $set: { hash: pbkdf2Sync(req.body.newpass, user.salt, 1000, 64, 'sha512').toString('hex') } })
    await tokens.deleteMany({ user: _id })
    return true
  })

  server.get('/list', async (req) => {
    return users.find().toArray()
  })
}
