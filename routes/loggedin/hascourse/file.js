const { syncFile } = require('../../../schemas')

/**
* @param {import('fastify').FastifyInstance} server
* @param {any} opts
*/
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const files = server.db.collection('files')

  server.post('/sync', { schema: syncFile }, async (req) => {
  })
}
