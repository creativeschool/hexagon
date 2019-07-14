const { ObjectId } = require('mongodb')
const { contentTry, contentDownload } = require('../../schemas')
const StreamHash = require('../../utils/hash')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').GridFSBucket} */
  const fs = server.fs

  server.register(require('fastify-multipart'), { limits: { files: 1, fields: 0 } })

  server.post('/provide', async (req) => {
    /** @type {import('stream').Readable[]} */
    const files = await new Promise((resolve, reject) => {
      const files = []
      req.multipart((field, file, filename, encoding, mime) => {
        files.push(file)
      }, (err) => {
        if (err) return reject(err)
        return resolve(files)
      })
    })
    if (files.length !== 1) throw server.httpErrors.badRequest()
    const [id, hash] = await new Promise((resolve, reject) => {
      const hash = new StreamHash()
      const stream = fs.openUploadStream('')
      const file = files[0]
      file.pipe(hash).pipe(stream).on('finish', () => resolve([stream.id, hash.hash.digest('hex')]))
    })
    const count = await fs.find({ name: hash }).count()
    if (count) {
      fs.delete(id)
      throw server.httpErrors.badRequest()
    } else {
      fs.rename(id, hash)
      return hash
    }
  })

  server.post('/try', { schema: contentTry }, async (req) => {
    const _id = new ObjectId(req.headers['x-file-hash'])
    return fs.find({ _id }).count()
  })

  server.post('/download', { schema: contentDownload }, async (req) => {
    const _id = new ObjectId(req.headers['x-file-hash'])
    return fs.openDownloadStream(_id)
  })
}
