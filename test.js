var test = require('tape')
var through = require('through2')
var spawn = require('child_process').spawn
var domain = require('./')

var port = 9999
var cmd = './node_modules/scuttlebot/bin.js'
var args = [ 'server', '--port', port ]
var child = spawn(cmd, args)

child.stdout.pipe(through(function(chunk, enc, cb) {
  var str = chunk.toString()
  var match = /^(\S+)\s\S+\sSBOT\s+(\S+)/i.exec(str)
  if (!match) return cb()

  if (match[1].indexOf('info') === -1 ||
      match[2].indexOf('listening') === -1) return cb()

  // the server is listening and we can start testing
  test('that we can get a token from localhost on port ' + port, function(t) {
    domain.getToken('localhost:' + port, function(err, res) {
      t.ok(!err, 'no error')
      t.ok(typeof res == 'object', 'result is an object')
      t.ok(res.role, 'token object has a role')
      t.ok(res.ts, 'token object has a timestamp')
      t.ok(res.keyId, 'token object has a key id')
      t.ok(res.hmac, 'token object has an hmac')
      child.kill()
      t.end()
    })
  })

}))

// TODO guess we need to auth before we can deauth
//domain.deauth('localhost', function (err, res) {
  //console.log(err, res)
//})
