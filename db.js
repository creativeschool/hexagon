const { MongoClient } = require('mongodb')

module.exports = async (ctx) => {
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  ctx.db = client.db('hex')
}
