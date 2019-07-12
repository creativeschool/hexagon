const wrapper = require('fastify-plugin')
const { MongoClient } = require('mongodb')
const chalk = require('chalk')

module.exports = wrapper(async (server, opts) => {
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  const db = client.db('hex')
  server.decorate('db', db)

  const log = x => console.log(chalk.yellow('INDEX') + '\t' + x)

  const users = db.collection('users')
  log(await users.createIndex({ name: 1 }, { unique: true }))
  log(await users.createIndex({ updated: -1 }))

  const courses = db.collection('courses')
  log(await courses.createIndex({ updated: -1 }))

  const userCourse = db.collection('user_course')
  log(await userCourse.createIndex({ user: 1, course: 1 }, { unique: true }))

  const files = db.collection('files')
  log(await files.createIndex({ updated: -1 }))

  const messages = db.collection('messages')
  log(await messages.createIndex({ updated: -1 }))
})
