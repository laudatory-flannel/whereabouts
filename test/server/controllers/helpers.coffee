
testHelpers = require("../../testHelpers")
db = require("../../../server/config/database")
User = require("../../../server/models/userModel")
Event = require("../../../server/models/eventModel")

# The main file we're testing
helpers = require("../../../server/controllers/helpers")


user1 = {
  name: "Rachel RoseFigura",
  fb_id: "4",
  friends: [],
  location: {type: "Point", coordinates: [-122.441, 37.762]}
}

event1 = {
  title: 'Party!',
  description: 'coding party',
  user: 'Rachel RoseFigura',
  createdAt: new Date(Date.now()),
  endedAt: new Date(+new Date() - 7*24*60*60*1000),
  active: true,
  location: {type: "Point", coordinates: [10,10]}
}

event2 = {
  title: 'Party!',
  description: 'coding party',
  user: 'Rachel RoseFigura',
  createdAt: new Date(Date.now()),
  endedAt: new Date(+new Date() + 7*24*60*60*1000), # current date plus 7 days
  active: true,
  location: {type: "Point", coordinates: [10,10]}
}


describe "helpers", () ->
  
  beforeEach (done) ->
    # Clear db before every test
    User.remove {}, (err, result) ->
      throw err if err
      Event.remove {}, (err, result) ->
        throw err if err
        console.log('CLEARED THE EVENT DB')
        return done()

  describe "#addUserToDb", () ->

    it "should add a user when that user doesn't exist", (done) ->

      # Verify that no user exists
      User.find {name: user1.name}, (err, foundUsers) ->
        throw err if err

        expect(foundUsers).to.have.length(0)

        helpers.addUserToDb user1, (err, result) ->
          throw err if err
          
          # Expect the object to be returned from this function
          expect(result.name).to.equal(user1.name)

          # Look up the object in the db to make sure it was really written
          User.find {name: user1.name}, (err, foundUsers) ->
            throw err if err

            expect(foundUsers).to.have.length(1)
            expect(foundUsers[0].name).to.equal(user1.name)
            expect(foundUsers[0].friends).to.have.length(0)

            return done()

    # describe "#getUserByName", () ->
    #   it "should return a user from the database", (done) ->

    #     # Get user by name 
    #     helpers.getUserByName "", (err, result) ->
    #       throw err if err

    #       # Expect the name to be correct
    #       expect(result).to.equal(null)

    #     # Create new user
    #     User.create user1, (err) ->
    #       throw err if err

    #       # Get user by name 
    #       helpers.getUserByName "Rachel RoseFigura", (err, result) ->
    #         throw err if err

    #         # Expect the name to be correct
    #         expect(result.name).to.equal(user1.name)

    #         return done()

  describe "#addEventToDb", () ->
    it "should add an event when that event doesn't exist", (done) ->

      # Verify that no event exists
      Event.find {name: event1.name}, (err, foundEvent) ->
        throw err if err

        expect(foundEvent).to.have.length(0)

        helpers.addEventToDb event1,(err, resultEvent) ->
          throw err if err
          
          # Expect the object to be returned from this function
          expect(resultEvent.title).to.equal(event1.title)
          # Look up the object in the db to make sure it was really written
          Event.find {title: event1.title}, (err, foundEvent) ->
            throw err if err

            expect(foundEvent).to.have.length(1)
            expect(foundEvent[0].user).to.equal(event1.user)
            expect(foundEvent[0].active).to.equal(event1.active)

            return done()

  describe "#getActiveEvents", () ->
    it "should get only active events", (done) ->

      Event.create event1,(err, result) -> # create an active event
        throw err if err
        
        helpers.getActiveEvents (err, activeEvents) ->
          throw err if err
          expect(activeEvents.length).to.equal(0)

          return done()
        
          # Look up the object in the db to make sure it was really written
          # Event.create event1 (err, foundActive) ->
          #   throw err if err

          #   helpers.getActiveEvents (err, activeEvents) ->
          #     throw err if err
          #     expect(activeEvents).to.have.length(1)
          #     expect(activeEvents[0].active).to.equal(event2.active)

          #     return done()

  describe "#expireEvents", () ->
    it "should not expire active events", (done) ->

      Event.create event2, (err, result) -> # create an active event
        throw err if err

        helpers.expireEvents (err, events) ->
          throw err if err
          console.log('here3')

          Event.find {active: true}, (err, foundActive) ->
            throw err if err
            console.log('here4')

            expect(foundActive).to.have.length(1)
            expect(foundActive[0].active).to.equal(true)
      
            return done() 

  # describe "#expireEvents", () ->
  #   it "should expire inactive events", (done) ->
  #     console.log('here1')
  #     Event.create event1,(err, result) ->
  #       throw err if err
  #       console.log('here2', result)
  #       helpers.expireEvents (err, events) ->
  #         throw err if err
  #       console.log('here3')
  #         # Look up the object in the db to make sure it was really written
  #       Event.find {active: true}, (err, foundEvent) ->
  #         throw err if err
  #         console.log('here4')
  #         console.log('foundEvent 1',foundEvent)
  #         expect(foundEvent).to.have.length(0)
  #         expect(foundEvent[0].active).to.equal(false)
  #         console.log('here5')

  #         return done()


























