const { noticeSync } = require('../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const notices = server.notices

  server.post('/sync', { schema: noticeSync }, async req => {
    return notices.find({ updated: { $gt: req.body.last } }).toArray()
  })
}
