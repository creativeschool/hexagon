const wrapper = require('fastify-plugin')
const redis = require('redis')

module.exports = wrapper(async (server, opts) => {
  const client = redis.createClient()
  server.decorate('redis', client)
})
