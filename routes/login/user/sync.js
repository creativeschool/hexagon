const { ObjectId } = require('mongodb')
const { userSync } = require('../../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const users = server.users

  // TODO: Add cache control
  server.post('/sync', { schema: userSync }, async (req) => {
    const header = req.headers['x-user-id']
    if (!header) throw server.httpErrors.forbidden()
    const user = await users.findOne({ _id: new ObjectId(header) }, { hash: 0, salt: 0 })
    if (!user) throw server.httpErrors.forbidden()
    return user
  })
}
