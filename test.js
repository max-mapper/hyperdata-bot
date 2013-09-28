var assert    = require('assert')
  , isLevelDB = require('./level-filter-stream').isLevelDB

assert(!isLevelDB({}))
assert(isLevelDB({ name: 'levelup' }))
assert(isLevelDB({ name: 'leveldown' }))
assert(isLevelDB({ name: 'level.js' }))
assert(isLevelDB({ name: 'leveljs' }))
assert(isLevelDB({ name: 'abstract-leveldown' }))

assert(!isLevelDB({ name: 'high-level' }))
assert(!isLevelDB({ name: 'highlevelthing' }))
assert(!isLevelDB({ name: 'low-level' }))
assert(!isLevelDB({ name: 'lowlevel' }))

assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'level.js' ]}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'leveldb' ]}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'levelup' ]}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'leveldown' ]}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'awesome leveldb sauce' ]}}}))
assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'bar', 'bang' ]}}}))

assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'highlevel' ]}}}))
assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'highlevel' ]}}}))
assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { keywords: [ 'lowlevel' ]}}}))

assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { dependencies: { levelup: '*' }}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { dependencies: { 'level.js': '*' }}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { dependencies: { leveldown: '*' }}}}))
assert(isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { dependencies: { 'bar': '*', 'abstract-leveldown': '*' }}}}))
assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { }}}))
assert(!isLevelDB({ 'dist-tags': { latest: 'foo' }, versions: { 'foo': { dependencies: { levelnot: '*' }}}}))
