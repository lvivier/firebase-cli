
/**
 * Dependencies
 */

var resolve = require('path').resolve
var exists = require('fs').existsSync
var request = require('superagent')
var Table = require('easy-table')
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


/**
 * Handle Firebase rules
 */

exports.rules = function (name, rules) {
  var set = (undefined !== rules)

  if (set) setRules(name, rules)
  else getRules(name)
}


/**
 * Seed firebase with new data
 */

exports.seed = function (name, str) {
  util.demand(name)
  util.demand(str)

  var data = loadJSON(str)

  // TODO this implementation sucks pretty much
  auth(function (err, token) {
    var api = new API(token)

    api.ref(name, function (err, ref) {
      ref.set(data, done)
    })

    function done (err) {
      if (err) throw err
      console.log('\nok')
      process.exit(0)
    }
  })
}


/**
 * Get rules for a firebase
 */

function getRules (name) {  
  util.demand(name)
  auth(function (err, token) {
    var api = new API(token)
    api.getRules(name, function (err, rules) {
      console.log(JSON.stringify(rules, null, 2))
    })
  })
}


/**
 * Set new rules on firebase
 */

function setRules (name, file) {
  util.demand(name)
  util.demand(file)

  auth(function (err, token) {
    var api = new API(token)
    var rules = loadJSON(file)

    if (!rules) return util.error('invalid rules')

    api.setRules(name, rules, function (err) {
      if (err) return util.error(err)
      console.log('\nok')
    })
  })
}


/**
 * Load JSON from a file or parse a string
 */

function loadJSON (str) {
  var path = resolve(process.cwd(), str)
  var data = false

  // ok to swallow errors b/c we return false
  try {
    if ('{'===str.charAt(0)) data = JSON.parse(str)
    if (exists(path)) data = require(path)
  } catch (e) {}

  return data
}
