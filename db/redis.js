const wrapper = require('fastify-plugin')
const redis = require('redis')

module.exports = wrapper(async (server, opts) => {
  const client = redis.createClient(process.env.REDIS_URL)
  server.decorate('redis', client)
})
