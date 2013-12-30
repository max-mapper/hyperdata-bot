var assert    = require('assert')
  , matches = require('./filter-stream').matches

assert(!matches({}))
assert(matches({ name: 'datapackage' }))
assert(matches({ name: 'data-package' }))
assert(matches({ name: 'data-package-thing' }))
assert(matches({ name: 'some-datapackage' }))
assert(matches({ name: 'dpm-thingy' }))
assert(matches({ name: 'hyperdata' }))

assert(!matches({ name: 'pizza' }))
