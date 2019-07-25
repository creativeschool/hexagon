const { contentProvide, contentTry } = require('../../schemas')
const StreamHash = require('../../utils/hash')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').GridFSBucket} */
  const fs = server.fs

  server.register(require('fastify-multipart'), { limits: { files: 1, fields: 0 } })

  server.post('/provide', { schema: contentProvide }, async (req) => {
    const [id, hash] = await new Promise((resolve, reject) => {
      let count = 0
      req.multipart((field, file, filename, encoding, mime) => {
        count++
        const hash = new StreamHash()
        const stream = fs.openUploadStream('')
        file.pipe(hash).pipe(stream).on('finish', () => resolve([stream.id, hash.hash.digest('hex')]))
      }, (err) => {
        if (err) return reject(err)
        if (!count) return reject(server.httpErrors.badRequest())
      })
    })
    const count = await fs.find({ filename: hash }).count()
    if (count) {
      fs.delete(id)
      throw server.httpErrors.badRequest()
    } else {
      fs.rename(id, hash)
      return hash
    }
  })

  server.post('/try', { schema: contentTry }, async (req) => {
    return fs.find({ filename: req.body }).count()
  })
}
