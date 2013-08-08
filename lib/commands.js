/**
 * Dependencies
 */

var Table = require('easy-table')
var request = require('superagent')
var moment = require('moment')
var open = require('open')

var config = require('./config')
var auth = require('./auth')
var util = require('./util')
var API = require('./api')


/**
 * Configure command
 */

exports.configure = function configure (key, value) {
  util.demand(key)
  config.resolve()

  if ('undefined' != typeof value) config.set(key, value)

  // TODO --silent
  console.log(key, ' :  ', config.get(key))
  config.save()
}


/**
 * Create Namespace command
 */
exports.create = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.create(name, util.error)
  })
}


/**
 * Remove Namespace command
 */
exports.rm = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.remove(name, util.error)
  })
}


/**
 * Open Namespace command
 */
exports.forge = function (name) {
  util.demand(name)
  var url = util.url(name)
  request
    .get(url)
    .end(function (res) {
      if (res.notFound)
        return util.error('not found')
      open(url)
    })
}

/**
 * List Namespaces command
 */
exports.ls = function () {
  auth(function (err, token) {
    var api = new API(token)
    api.account(showInfo)
  })
  
  function showInfo (err, info) {
    if (!info.namespaces) return

    var ns = info.namespaces
    var t = new Table()

    for (var item in ns) {
      if (!ns.hasOwnProperty(item)) continue
      t.cell('name', item)
      t.cell('created', moment(ns[item]).format('YYYY-MM-DD'))
      t.cell('url', util.url(item))
      t.newRow()
    }
    console.log('\n'+t.print())
  }
}
