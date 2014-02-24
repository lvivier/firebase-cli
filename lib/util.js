/**
 * Dependencies
 */
var app = require('commander')
var join = require('path').join

/**
 * Demand an arg be present
 */
exports.demand = function (arg) {
  if ('undefined' != typeof arg) return
  app.help()
  process.exit(1)
}

/**
 * Die due to error
 */
exports.error = function (err) {
  if (!err) return
  console.error(err)
  process.exit(1)
}

/**
 * Get the URL of a firebase
 */
exports.url = function (name, path) {
  var domain = name+'.firebaseio.com/'
  return 'https://' + (path ? join(domain, path) : domain)
}
