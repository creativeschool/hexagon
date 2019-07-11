const { pbkdf2Sync, randomBytes } = require('crypto')
const { login } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance<Server, IncomingMessage, ServerResponse>} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.db.collection('users')
  /** @type {import('mongodb').Collection} */
  const tokens = server.db.collection('tokens')

  server.post('/login', { schema: login }, async (req) => {
    const user = await users.findOne({ name: req.body.name })
    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) return ''
    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: user._id })
    return token
  })
  server.register(require('./user'), { prefix: '/user' })
  server.register(require('./course'), { prefix: '/course' })
}
