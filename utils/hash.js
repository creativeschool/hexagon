const { Transform } = require('stream')
const crypto = require('crypto')

class StreamHash extends Transform {
  constructor (opts) {
    super(opts)
    this.hash = crypto.createHash('sha1')
  }
  _transform (chunk, encoding, callback) {
    this.hash.update(chunk)
    this.push(chunk)
    callback()
  }
}

module.exports = StreamHash
