const { pbkdf2Sync, randomBytes } = require('crypto')
const { signin } = require('../schemas')
const defaultUserMeta = require('../defaults/user')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users
  /** @type {import('mongodb').Collection} */
  const tokens = server.tokens

  server.post('/common', { schema: signin }, async req => {
    const user = await users.findOne({ login: req.body.login }, { salt: 1, hash: 1, meta: 1 })
    if (!user) throw server.httpErrors.notFound()

    const now = +new Date()
    // DO NOT use nested prop in meta
    const meta = Object.assign({}, defaultUserMeta, user.meta)

    if (meta.restrictBefore && now >= meta.restrictBefore) {
      throw server.httpErrors.forbidden('Account expired')
    }

    const hash = pbkdf2Sync(req.body.pass, user.salt, 1000, 64, 'sha512').toString('hex')
    if (hash !== user.hash) throw server.httpErrors.forbidden()

    if (meta.stickyLogin) {
      const last = await tokens.findOne({ user: user._id }, { sort: [['_id', -1]] })
      if (last && now <= +last._id.getTimestamp() + meta.stickyLogin) {
        throw server.httpErrors.forbidden('Sticky login')
      }
    }

    if (meta.singleLogin) {
      await tokens.deleteMany({ user: user._id })
    }

    const value = randomBytes(32).toString('hex')
    await tokens.insertOne({ value, user: user._id })

    return value
  })
}
