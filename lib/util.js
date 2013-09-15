var app = require('commander')
var join = require('path').join

/**
 * Utilities
 */

// demand an arg be present
exports.demand = function (arg) {
  if ('undefined' != typeof arg) return
  app.help()
  process.exit(1)
}

// die due to error
exports.error = function (err) {
  if (!err) return
  console.error(err)
  process.exit(1)
}

// get the url of a namespace
exports.url = function (namespace, path) {
  var domain = namespace+'.firebaseio.com/'
  return 'https://' + (path ? join(domain, path) : domain)
}
