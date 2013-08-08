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
 * Creates a new namespace
 */
Api.prototype.create = function (name, fn) {
  var token = this.token

  request
    .get('https://admin.firebase.com/namespace/create')
    .query({token: token, namespace: name})
    .end(function (res) {
      if (false === res.body.success) {
        return fn(new Error(res.body.error))
      }
      return fn(null)
    })
}

/**
 * Removes an existing namespace
 */
Api.prototype.remove = function (name, fn) {
  request
    .get('https://admin.firebase.com/namespace/remove')
    .query({token: this.token, namespace: name})
    .end(function (res) {
      if (false === res.body.success) {
        return fn(new Error(res.body.error))
      }
      return fn(null)
    })
}

/**
 * Namespace info
 */
Api.prototype.info = function (namespace, fn) {}

/**
 * Account info
 */
Api.prototype.account = function (fn) {
  request
    .get('https://admin.firebase.com/account')
    .query({token: this.token})
    .end(function (res) {
      if (!res.ok) return fn(new Error('it is not ok'))
      fn(null, res.body)
    })
}
