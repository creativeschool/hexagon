import { bus } from '@/plugins/bus'

const { MongoClient, GridFSBucket } = window.require('mongodb')

const connect = async () => {
  /** @type {import('mongodb').MongoClient} */
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  const db = client.db('hex')
  /** @type {import('mongodb').GridFSBucket} */
  const fs = new GridFSBucket(db)
  const users = db.collection('users')
  const courses = db.collection('courses')
  const userCourse = db.collection('user_course')
  const files = db.collection('files')
  const msgs = db.collection('msgs')
  const tokens = db.collection('tokens')
  return { client, db, fs, users, courses, userCourse, files, msgs, tokens }
}

export const connection = connect()

connection.catch(e => bus.$emit('error', e))
