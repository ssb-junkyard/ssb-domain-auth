var test = require('tape')
var domain = require('./')

test('that we can get a token from localhost', function(t) {
  domain.getToken('localhost', function(err, res) {
    t.ok(!err, 'no error')
    t.ok(typeof res == 'object', 'result is an object')
    t.ok(res.role, 'token object has a role')
    t.ok(res.ts, 'token object has a timestamp')
    t.ok(res.keyId, 'token object has a key id')
    t.ok(res.hmac, 'token object has an hmac')
    t.end()
  })
})

// TODO guess we need to auth before we can deauth
//domain.deauth('localhost', function (err, res) {
  //console.log(err, res)
//})
