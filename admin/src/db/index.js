import { bus } from '@/plugins/bus'

const { MongoClient, GridFSBucket } = require('mongodb')

const connect = async () => {
  /** @type {import('mongodb').MongoClient} */
  const client = new MongoClient('mongodb://localhost:27017/hex', { useNewUrlParser: true })
  await client.connect()
  const db = client.db('hex')
  /** @type {import('mongodb').GridFSBucket} */
  const fs = new GridFSBucket(db)
  const users = db.collection('users')
  const courses = db.collection('courses')
  const ucmap = db.collection('ucmap')
  const files = db.collection('files')
  const msgs = db.collection('msgs')
  const tokens = db.collection('tokens')
  return { client, db, fs, users, courses, ucmap, files, msgs, tokens }
}

export const connection = connect()

connection.catch(e => bus.$emit('error', e))
