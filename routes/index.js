const { version } = require('../package.json')
const { index } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  server.get('/', { schema: index }, async req => {
    return { version, utf8: '⬡' }
  })
  server.register(require('./login'), { prefix: '/login' })
  server.register(require('./signin'), { prefix: '/signin' })
  server.register(require('./token'), { prefix: '/token' })
  server.register(require('./download'), { prefix: '/download' })
}
