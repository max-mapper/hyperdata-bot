const NpmPublishStream  = require('npm-publish-stream')
    , jerk              = require('jerk')
    , LevelFilterStream = require('./level-filter-stream')
    , options           = require('./options')

/* options.json needs to be like this:
{
    "server"     : "irc.freenode.net"
  , "nick"       : "<some username>"
  , "channels"   : [ "##leveldb" ]
  , "password"   : "<some password>"
}
*/

var bot

function setup () {
  bot.say('NickServ', 'identify ' + options.password)

  new NpmPublishStream({ startTime: new Date(Date.now() - 1000 * 60 * 60 * 1) })
    .pipe(new LevelFilterStream())
    .on('data', function (data) {
      bot.say(
          options.channels[0]
          ,   '[npm] '
            + data.id + '@' + data.doc['dist-tags'].latest
            + ' <http://npm.im/' + data.id + '>: '
            + (data.doc.description || '')
      )
    })
    .on('error', console.log)
}

options.onConnect = function () { setTimeout(setup, 5000) }
bot = jerk(function (j) { /* TODO: something fun... */ }).connect(options)