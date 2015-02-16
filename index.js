var querystr = require('querystring')
var address = require('ssb-address')
var hyperquest = require('hyperquest')
var concat = require('concat-stream')

var ACCESS_PATH = '/access.json'
var AUTH_PATH = '/auth.html'

module.exports = {
  getToken: function(addr, cb) {
    addr = address(addr)
    var req = hyperquest.get(addr.domain + ACCESS_PATH)
    req.setHeader('Content-Type', 'application/json')
    req.on('response', function(res) {
      if (res.statusCode < 200 || res.statusCode >= 400)
        return cb(new Error(res.statusCode + ' ' + res.statusMessage))
      res.pipe(concat(function(body) {
        try {
          var json = JSON.parse(body)
          cb(null, json)
        } catch (e) {
          cb(new Error('Failed to parse json response'))
        }
      }))
    })
    req.on('error', cb)
  },
  deauth: function(addr, cb) {
    addr = address(addr)
    var req = hyperquest.delete(address(addr).domain + AUTH_PATH)
    req.on('response', function(res) {
      if (res.statusCode < 200 || res.statusCode >= 400)
        return cb(new Error(res.statusCode + ' ' + res.statusMessage))
      return cb()
    })
    req.on('error', cb)
  }
}
