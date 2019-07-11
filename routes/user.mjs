export default async (ctx) => {
  /** @type {import('server').FastifyInstance} */
  const server = ctx.server
  /** @type {import('mongodb').Collection} */
  const users = ctx.db.collection('users')

  server.get('/user', async (req, res) => {
    return users.find().toArray()
  })
  server.post('/user', async (req, res) => {
    return {}
  })
}
