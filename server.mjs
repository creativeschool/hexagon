import Fastify from 'fastify'
import routes from './routes/index.mjs'

export default async (ctx) => {
  const server = Fastify({ logger: true })
  ctx.server = server
  await routes(ctx)
}
