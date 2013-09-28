const TransformStream = require('stream').Transform
    , inherits        = require('util').inherits
    , levelDeps       = [ 'levelup', 'leveldown', 'level.js', 'abstract-leveldown', 'level' ]

    , stripRe         = /(high|low)[\- ]?level/gi
    , matchRe         = /level(-|up|down|db|\.?js)/i

function inArray (arr, test, strip) {
  var i = 0
    , testElement = test instanceof RegExp
        ? function (el) { return test.test(el) }
        : function (el) { return test.indexOf(el) > -1 } // test = array

  for (; Array.isArray(arr) && i < arr.length; i++)
    if (testElement(strip ? arr[i].replace(strip, '') : arr[i]))
      return true

  return false
}

function isLevelDB (pkg) {
  if (!pkg)
    return false

  if (pkg.name && matchRe.test(pkg.name.replace(stripRe, '')))
    return true

  var v = pkg['dist-tags'] && pkg['dist-tags'].latest

  if (!v || !pkg.versions || !pkg.versions[v])
    return false

  if (inArray(pkg.versions[v].keywords, matchRe, stripRe))
    return true

  if (inArray(Object.keys(pkg.versions[v].dependencies || {}), levelDeps))
    return true

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

module.exports           = LevelFilterStream
module.exports.isLevelDB = isLevelDB
