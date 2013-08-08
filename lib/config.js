/**
 * Dependencies
 */

var config = require('getset')
var touch = require('touch')

/**
 * Configuration persistence
 */

module.exports = config

// TODO --local option
var file = process.env['HOME'] + '/.fb'
var defaults = {
  token: '',
  expires: ''
}

touch.sync(file)
config.load(file)
config.merge(defaults)
