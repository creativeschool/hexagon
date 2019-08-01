const wrapper = require('fastify-plugin')
const { MongoClient, GridFSBucket } = require('mongodb')
const chalk = require('chalk')

module.exports = wrapper(async (server, opts) => {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost', { useNewUrlParser: true })
  await client.connect()
  const db = client.db('hex')
  const fs = new GridFSBucket(db)
  server.decorate('fs', fs)

  const log = x => console.log(chalk.yellow('INDEX') + '\t' + x)

  const users = db.collection('users')
  server.decorate('users', users)
  log(await users.createIndex({ login: 1 }, { unique: true }))
  log(await users.createIndex({ updated: -1 }))

  const courses = db.collection('courses')
  server.decorate('courses', courses)
  log(await courses.createIndex({ name: 1 }, { unique: true }))
  log(await courses.createIndex({ updated: -1 }))

  const ucmap = db.collection('ucmap')
  server.decorate('ucmap', ucmap)
  log(await ucmap.createIndex({ user: 1, course: 1 }, { unique: true }))
  log(await ucmap.createIndex({ user: 1, updated: -1 }))
  log(await ucmap.createIndex({ course: 1, updated: -1 }))

  const files = db.collection('files')
  server.decorate('files', files)
  log(await files.createIndex({ course: 1, updated: -1 }))

  const msgs = db.collection('msgs')
  server.decorate('msgs', msgs)
  log(await msgs.createIndex({ course: 1, updated: -1 }))

  const tokens = db.collection('tokens')
  server.decorate('tokens', tokens)
  log(await tokens.createIndex({ value: 1 }))
  log(await tokens.createIndex({ user: 1 }))

  const notices = db.collection('notices')
  server.decorate('notices', notices)
  log(await notices.createIndex({ updated: -1 }))
})
