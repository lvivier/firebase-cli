
/**
 * Dependencies
 */

var parallel = require('nimble').parallel
var Firebase = require('firebase')
var http = require('superagent')
var encode = encodeURIComponent
var url = require('./util').url


/**
 * Firebase REST API
 */

module.exports = Api

function Api (token) {
  this.token = token
}


/**
 * Validates an auth token
 */

Api.prototype.validate = function (fn) {
  this.req('get', 'token/validate', fn)
}


/**
 * Creates a new firebase
 */

Api.prototype.create = function (name, fn) {
  this.req('post', 'firebase/'+encode(name), fn)
}


/**
 * Removes an existing firebase
 */

Api.prototype.remove = function (name, fn) {
  this.req('delete', 'firebase/'+encode(name), {namespace: name}, fn)
}


/**
 * Firebase info
 */

Api.prototype.info = function (name, fn) {
  var metrics = ['storage', 'bandwidth30d', 'concurrents30d']
    , query = {now: (new Date()).getTime()}
    , error = null
    , info = {}
    , req = this.req.bind(this)

  // an array of request fns
  var fns = metrics.map(function (metric) {
    return function (cb) {
      if (error) return
      req('get', 'firebase/'+encode(name)+'/'+metric, query, function (err, res) {
        if (err) return error = err
        info[metric] = ('number' === typeof res) ? res : 0
        cb()
      })
    }
  })

  parallel(fns, function () { fn(error, info) })
}


/**
 * Gets an auth token for firebase
 */

Api.prototype.getToken = function (name, fn) {
  this.req('get', 'firebase/'+encode(name)+'/token', {namespace:name}, function (err, res) {
    fn(err, res.authToken)
  })
}


/**
 * Gets the rules.json for firebase
 */

Api.prototype.getRules = function (name, fn) {
  this.getToken(name, function (err, token) {
    http
      .get(url(name,'.settings/rules.json'))
      .query({auth: token})
      .end(function (err, res) {
        if (err) return fn(err)
        fn(null, res.body)
      })
  })
}


/**
 * Set the rules.json for firebase
 */

Api.prototype.setRules = function (name, obj, fn) {
  this.getToken(name, function (err, token) {
    http
      .put(url(name, '.settings/rules.json'))
      .query({auth: token})
      .send(obj)
      .end(function (err, res) {
        if (err) return fn(err)
        if (!res.ok) return fn(new Error(res.body.error))

        fn(null, res.body)
      })
  })
}


/**
 * Get an authenticated ref to a firebase
 */

Api.prototype.ref = function (name, fn) {
  this.getToken(name, function (err, token) {
    var loc = url(name, '/')
    var ref = new Firebase(loc)

    if (err) return fn(err)

    ref.auth(token, function (err) {
      fn(err, ref)
    })
  })
}


/**
 * Account info
 */

Api.prototype.account = function (fn) {
  this.req('get','account', fn)
}


/**
 * Firebase HTTP API shiz
 */

Api.prototype.req = function (method, resource, query, fn) {
  // query obj is optional
  if ('function' == typeof query) {
    fn = query
    query = {}
  }

  http(method, 'https://admin.firebase.com/'+resource)
      .query({token: this.token})
      .query(query || {})
      .end(function (err, res) {
        // TODO handle timeouts and 404s
        if (err) return fn(err)
        if (res.body && res.body.error) {
          return fn(new Error(res.body.error))
        }
        return fn(null, res.body)
      })
}
