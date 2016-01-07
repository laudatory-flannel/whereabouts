
global.process.env.NODE_ENV = "testing"
global.expect = require("expect.js")

User = require("../server/models/userModel")
Event = require("../server/models/eventModel")

helpers = {

}

before (done) ->
  console.log ""
  User.remove {}, (err, result) ->
    console.log "* Cleared User collection!"
    Event.remove {}, (err, result) ->
      console.log "* Cleared Event collection!"
      console.log ""
      console.log "-----------------"
      console.log "Begin test suite"
      console.log "-----------------"
      console.log ""
      return done()

module.exports = helpers

