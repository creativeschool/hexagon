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

  server.get('/:token', async (req, res) => {
    const hash = await getAsync(req.params.token)
    if (!hash) throw server.httpErrors.forbidden()
    if (req.query.filename) res.header('Content-Disposition', 'attachment;filename=' + encodeURIComponent(req.query.filename))
    return fs.openDownloadStreamByName(hash)
  })
}
