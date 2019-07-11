import db from './db.js'
import server from './server.mjs'

(async () => {
  const context = {}
  await db(context)
  await server(context)
  console.log('HEXAGON started')
})()
