# testHelpers = require("../testHelpers")
# db = require("../../server/config/database")
# User = require("../../server/models/userModel")
# Event = require("../../server/models/eventModel")
# Request = require("request")


# user1 = {
#   name: "Bizarro Mr.Rodgers",
#   fb_id: "666420LOLOL",
#   friends: ["Some String", "Some Other String", "A big bag of tumors"],
#   location: {type: "Point", coordinates: [-122.441, 37.762]}
# }

# event1 = {
#   title: 'A party',
#   description: 'People congregating in a specific place for the purpose of celebrating',
#   user: 'A person',
#   createdAt: new Date(Date.now()),
#   endedAt: new Date(Date.now()),
#   active: true,
#   location: {type: "Point", coordinates: [10,10]}
# }

# describe "API", () ->

# 	beforeEach () ->
# 		User.remove {}, (err, result) ->
# 			throw err if err
# 			Event.remove {}, (err, result) ->
# 				throw err if err
# 				return done()

# 	describe "#API", () ->

# 		it "should add an event when an event is posted to /events", done ->
# 			