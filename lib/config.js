/**
 * Dependencies
 */

var debug = require('debug')('config')
var config = require('getset')
var touch = require('touch')
var path = require('path')

/**
 * Configuration persistence
 */

module.exports = config

// defaults
config.merge({
  token: '',
  expires: ''
})

// determine which file to use
config.resolve = function (file) {

  // do nothing if loaded already
  if (config._file) return

  if (file)
    file = path.resolve(process.cwd(), file)
  else
    file = (process.env['HOME'] + '/.fb')

  debug('file: ', file)

  touch.sync(file)
  config.load(file)
}
