const { promisify } = require('util')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').GridFSBucket} */
  const fs = server.fs
  /** @type {import('redis').RedisClient} */
  const redis = server.redis
  const getAsync = promisify(redis.get).bind(redis)

  server.get('/:token', async (req) => {
    const hash = await getAsync(req.params.token)
    if (!hash) throw server.httpErrors.forbidden()
    return fs.openDownloadStreamByName(hash)
  })
}
