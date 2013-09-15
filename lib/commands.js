/**
 * Dependencies
 */

var Table = require('easy-table')
var request = require('superagent')
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
 * Create firebase command
 */
exports.create = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.create(name, util.error)
  })
}


/**
 * Remove firebase command
 */
exports.rm = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.remove(name, util.error)
  })
}


/**
 * Opens firebase in Forge
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
 * Shows info on a firebase
 */
exports.info = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.info(name, showInfo)

    function showInfo (err, info) {
      // TODO handle errors
      
      var t = new Table()
      t.cell('Storage (bytes)', info.storage)
      t.cell('Bandwidth (30 days, bytes)', info.bandwidth30d)
      t.cell('Peak Concurrents (30 days)', info.concurrents30d)
      t.newRow()
      console.log('\n'+t.printTransposed())
    }
  })
}

/**
 * Outputs Firebase rules
 */
exports.rules = function (name) {
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.getRules(name, function (err, rules) {
      console.log(JSON.stringify(rules, null, 2))
    })
  })
}

/**
 * Migrate Firebase to new rules
 */
exports.migrate = function (name, file) {
  util.demand(name)
  // TODO implement this like: read from stdin if no file
  console.log('Not implemented')
}

/**
 * List firebases command
 */
exports.ls = function () {
  auth(function (err, token) {
    var api = new API(token)
    api.account(showInfo)
  })
  
  function showInfo (err, info) {
    if (!info.firebases) return

    var ns = info.firebases
    var t = new Table()

    for (var item in ns) {
      if (!ns.hasOwnProperty(item)) continue

      t.cell('name', item)
      t.cell('url', util.url(item))
      t.newRow()
    }
    console.log('\n'+t.print())
  }
}
