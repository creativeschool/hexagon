const { pbkdf2Sync, randomBytes } = require('crypto')
const { signin } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.post('/common', { schema: signin }, async (req) => {
    const user = await users.findOne({ login: req.body.login }, { salt: 1, hash: 1 })
    if (!user) throw server.httpErrors.notFound()

    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()

    const token = randomBytes(32).toString('hex')
    await tokens.insertOne({ _id: token, user: user._id })
    return token
  })
}
