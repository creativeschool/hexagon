const wrapper = require('fastify-plugin')
const { MongoClient, GridFSBucket } = require('mongodb')
const chalk = require('chalk')

module.exports = wrapper(async (server, opts) => {
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  const db = client.db('hex')
  server.decorate('db', db)
  const fs = new GridFSBucket(db)
  server.decorate('fs', fs)

  const log = x => console.log(chalk.yellow('INDEX') + '\t' + x)

  const users = db.collection('users')
  server.decorate('users', users)
  log(await users.createIndex({ login: 1 }, { unique: true }))
  log(await users.createIndex({ updated: -1 }))

  const courses = db.collection('courses')
  server.decorate('courses', courses)
  log(await courses.createIndex({ updated: -1 }))

  const userCourse = db.collection('user_course')
  server.decorate('userCourse', userCourse)
  log(await userCourse.createIndex({ user: 1, course: 1 }, { unique: true }))

  const files = db.collection('files')
  server.decorate('files', files)
  log(await files.createIndex({ updated: -1 }))

  const msgs = db.collection('msgs')
  server.decorate('msgs', msgs)
  log(await msgs.createIndex({ updated: -1 }))

  const tokens = db.collection('tokens')
  server.decorate('tokens', tokens)
})
