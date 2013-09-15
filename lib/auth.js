/**
 * Dependencies
 */

var request = require('superagent')
var series = require('nimble').series
var app = require('commander')

var config = require('./config')
var Api = require('./api')

/**
 * gimme an admin.firebase.com auth token!!
 */

module.exports = auth

function auth (fn) {
  config.resolve()

  var token = config.get('token')
  var tries = 3
  var api = new Api(token)

  // if we have a token and it's still good, use it
  if (token && token.length) {
    api.validate(function (err, res) {
      if (res.success) return fn(null, token)
      console.error('[invalid token]\n')
      input(get)
    })
  }
  else {  
    input(get)
  }

  // get user input and authenticate
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
    .query({ email: data.login, password: data.pass, rememberMe: true })
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
  series([username, password], done)

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
