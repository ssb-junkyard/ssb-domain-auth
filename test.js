var test = require('tape')
var spawn = require('child_process').spawn
var match = require('match-through')
var domain = require('./')

var port = 9999
var cmd = './node_modules/scuttlebot/bin.js'
var args = [ 'server', '--port', port ]
var child = spawn(cmd, args)

child.stdout.pipe(match(/.*info.*listening.*/i, function() {
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
