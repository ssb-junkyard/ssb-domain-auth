# SSB Domain Auth

retrieve rpc-auth tokens from scuttlebot for web domains

example:

```js
var muxrpc     = require('muxrpc')
var Serializer = require('pull-serializer')
var auth       = require('ssb-domain-auth')
var chan       = require('ssb-channel')

var ssb        = muxrpc(ssbManifest, false, serialize)()
var localhost  = chan.connect(ssb, 'localhost')

localhost.on('connect', function() {
  // authenticate the connection
  auth.getToken('localhost', function(err, token) {
    if (err) return localhost.close(), console.error('Token fetch failed', err)
    ssb.auth(token, function(err) {
      if (err) return localhost.close(), console.error('Auth failed', err)

      // get session info
      ssb.whoami(function(err, user) {
        console.log(user)
      })
    })
  })
})

var loginBtn = document.getElementById('loginbtn')
var logoutBtn = document.getElementById('logoutbtn')

loginBtn.onclick = function(e){
  e.preventDefault()
  auth.openAuthPopup('localhost', {
    title: '3rd-party App Auth',
    perms: ['whoami'] // list of methods you want
  }, function(err, granted) {
    if (granted)
      localhost.reconnect()
  })
}
logoutBtn.onclick = function(e){
  e.preventDefault()
  auth.deauth('localhost')
  localhost.close()
}

function serialize (stream) {
  return Serializer(stream, JSON, {split: '\n\n'})
}

var ssbManifest = {
  // this is just subset of the ssb api
  auth: 'async',
  whoami: 'async'
}
```

api:

```js
var auth = require('ssb-domain-auth')
auth.getToken(addr, cb)
auth.openAuthPopup(addr, { title: 'App Title', perms: ['list', 'of', 'rpc', 'methods' ] }, cb)
auth.deauth(addr)
auth.getAuthUrl(addr, queryStringOptsObject)
```