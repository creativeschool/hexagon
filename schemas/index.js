const fs = require('fs')
const path = require('path')

const special = ['body.json', 'querystring.json', 'params.json', 'headers.json']

function loadSchema (fullpath) {
  const schema = { response: {} }
  fs.readdirSync(fullpath).filter(x => x.endsWith('.json')).forEach(x => {
    (special.includes(x) ? schema : schema.response)[x.substr(0, x.length - 5)] = require(path.join(fullpath, x))
  })
  return schema
}

fs.readdirSync(__dirname).forEach(name => {
  const fullpath = path.join(__dirname, name)
  if (fs.statSync(fullpath).isDirectory()) {
    console.log(`Loading schema for ${name}`)
    exports[name] = loadSchema(fullpath)
  }
})
