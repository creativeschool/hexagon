const { pbkdf2Sync, randomBytes } = require('crypto')
const { login } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.post('/login', { schema: login }, async (req) => {
    const user = await users.findOne({ name: req.body.name }, { salt: 1, hash: 1 })
    if (!user) throw server.httpErrors.notFound()

    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()

    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: user._id })
    return token
  })
  server.register(require('./loggedin'))
}
