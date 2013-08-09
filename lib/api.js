/**
 * Dependencies
 */

var request = require('superagent')

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
  this.adminRpc('token/validate', fn)
}

/**
 * Creates a new namespace
 */
Api.prototype.create = function (name, fn) {
  this.adminRpc('namespace/create', name, fn)
}

/**
 * Removes an existing namespace
 */
Api.prototype.remove = function (name, fn) {
  this.adminRpc('namespace/remove', name, fn)
}

/**
 * Namespace info
 */
Api.prototype.info = function (name, fn) {}

/**
 * Account info
 */
Api.prototype.account = function (fn) {
  this.adminRpc('account', fn)
}

/**
 * Firebase uses rpc-style URLs with only GET 
 * requests to handle its namespace- and account-
 * level shit.
 */
Api.prototype.adminRpc = function (procedure, name, fn) {
  // name is optional
  if ('function' == typeof name) {
    fn = name
    name = null
  }

  var namespace = name ? {namespace: name} : {}

  request
    .get('https://admin.firebase.com/'+procedure)
      .query({token: this.token})
      .query(namespace)
      .end(function (res) {
        // TODO handle timeouts and 404s
        if (res.body && res.body.error) {
          return fn(new Error(res.body.error))
        }

        return fn(null, res.body)
      })
}
