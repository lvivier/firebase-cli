/**
 * Dependencies
 */

var o = require('nimble')
var request = require('superagent')
var config = require('./config')
var app = require('commander')

/**
 * gimme an admin.firebase.com auth token!!
 */

module.exports = auth

function auth (fn) {
  var token   = config.get('token')
  var expires = config.get('token_expires')
  var tries = 3

  // if we have a token and it's still good, use it
  if (token && token.length && !expires || expires > Date.now()) {
    return fn(null, token)
  }
  // get user input and authenticate
  input(get)

  function get (err, data) {
    getFirebaseToken(data, function (err, token) {
      // try again...
      if (err) {
        if (--tries) {
          console.log(err)
          return input(app, get)
        }
        console.log('unable to authenticate, exiting...')
        process.exit(1)
      }
      config.update('token', token)
      config.update('expires', expires)
      fn(null, token)
    })
  }
}

/**
 * Get a Firebase token
 */
function getFirebaseToken (data, fn) {
  request
    .get('https://admin.firebase.com/account/login')
    .query({ email: data.login, password: data.pass })
    .end(function (res) {

      var token = res.body.adminToken
      if (!token) return fn(new Error('firebase auth error, check email and password'))
      fn(null, token)
    })
}

/**
 * Get user input
 */
function input (fn) {
  var data = {}
  o.series([username, password], done)

  function done () {
    var err = null
    if (!(data.login && data.pass)) {
      err = new Error('incorrect input')
    }
    fn(err, data)
  }

  // enter username
  function username (cb) {
    app.prompt('email: ', function (login) {
      data.login = login
      cb()
    })
  }

  // enter password
  function password (cb) {
    app.password('password: ', function (pass) {
      data.pass = pass
      cb()
    })
  }
}
