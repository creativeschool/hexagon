const wrapper = require('fastify-plugin')
const { MongoClient } = require('mongodb')

module.exports = wrapper(async (server, opts) => {
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  server.decorate('db', client.db('hex'))
})
