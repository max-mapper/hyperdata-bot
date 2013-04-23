const TransformStream  = require('stream').Transform
    , inherits         = require('util').inherits

function isLevelDB (pkg) {
  if (!pkg)
    return false

  if (pkg.name && /level(-|up|down|db)/.test(pkg.name))
    return true
  var v = pkg['dist-tags'] && pkg['dist-tags'].latest
    , i
  if (v && pkg.versions && pkg.versions[v] && Array.isArray(pkg.versions[v].keywords)) {
    for (i = 0; i < pkg.versions[v].keywords.length; i++)
      if (/level(up|down|db)/.test(pkg.versions[v].keywords[i]))
        return true
  }
  return false
}

function LevelFilterStream() {
  TransformStream.call(this, { objectMode: true })
}

inherits(LevelFilterStream, TransformStream)

LevelFilterStream.prototype._transform = function(chunk, encoding, callback) {
  if (isLevelDB(chunk.doc))
    this.push(chunk)
  callback()
}

module.exports = LevelFilterStream