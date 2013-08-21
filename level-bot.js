const NpmPublishStream  = require('npm-publish-stream')
    , jerk              = require('jerk')
    , fs                = require('fs')
    , path              = require('path')
    , LevelFilterStream = require('./level-filter-stream')
    , options           = require('./options')

    , dataStore         = path.join(process.env.HOME, '.levelbot.json')

/* options.json needs to be like this:
{
    "server"     : "irc.freenode.net"
  , "nick"       : "<some username>"
  , "channels"   : [ "##leveldb", "#leveldb" ]
  , "password"   : "<some password>"
}
*/

var bot
  , streaming = false

function setup () {
  bot.say('NickServ', 'identify ' + options.password)

  if (streaming) return

  new NpmPublishStream({ startTime: new Date(Date.now() - 1000 * 60 * 60 * 1) })
    .on('error', console.error)
    .pipe(new LevelFilterStream())
    .on('data', function (data) {
      bot.say(
          options.channels[0]
          ,   '[npm] '
            + data.id + '@' + data.doc['dist-tags'].latest
            + ' <http://npm.im/' + data.id + '>: '
            + (data.doc.description || '')
            + ' (' + data.doc.versions[data.doc['dist-tags'].latest].maintainers
                      .map(function (m) { return '@' + m.name }).join(', ') + ')'
      )
    })

  streaming = true
}

// Sync, cause it's easy and this isn't very often
function redirectUser (channel, user) {
  if (channel != options.redirectChannel)
    return

  var data = fs.readFileSync(dataStore, 'utf8')
  data = JSON.parse(data)
  if (!data.redirectedUsers)
    data.redirectedUsers = []

  if (data.redirectedUsers.indexOf(user) > -1)
    return

  bot.say(
      channel
    ,   user
      + ': not much happening in here, /join ##leveldb, that\'s where the action is!'
  )
  data.redirectedUsers.push(user)

  fs.writeFileSync(dataStore, JSON.stringify(data, null, 2), 'utf8', function () {})
}

options.onConnect = function () { setTimeout(setup, 5000) }
bot = jerk(function (j) {
  options.redirectChannel && j.watch_for('.*', function (msg) {
    redirectUser(msg.source.toString(), msg.user)
  })

  options.redirectChannel && j.user_join(function (msg) {
    redirectUser(msg.text[0], msg.user)
  })
}).connect(options)

if (!fs.existsSync(dataStore)) {
  fs.writeFileSync(dataStore, '{}', 'utf8')
}
