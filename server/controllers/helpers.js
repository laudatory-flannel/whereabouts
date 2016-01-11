var User = require('../models/userModel.js');
var Event = require('../models/eventModel.js');
var ObjectId = require('mongoose').Types.ObjectId;

var utils = {

  //Add user to db
  addUserToDb: function(userObj, cb) {
    var query = {'name':userObj.name};
    var data = {
        $set: {
          userObj
        }
    }

    //Finds a user in the database and updates if user exists or creates new user
    User.findOneAndUpdate(query, data, {upsert:true, 'new': true}, function(err, result){
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, result);
    });
  },

  //Get user based on name
  getUsers: function(cb) {
    User.find({}, function(err, result) {
      if (err) {
        console.log(err);
        return res.send(500, { error: err });
      }
      return cb(null, result);
    });
  },

  //Get user based on id
  getUserById: function(id, cb) {
    User.findById(id, function(err, user) {
      if(err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, user);
    });
  },

  //Get or create user based on Facebook ID (Authetication)
  getOrCreateUserByFbId: function(fbId, user, cb) {
    User.findOneAndUpdate({fbId: fbId}, user, {upsert: true, 'new': true}, function(err, user) {
      if(err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, user);
    });
  },

  //Adds or removes a friend from a users' friend list based on passed in method
    // $addToSet adds friend to set if friend does not already exist in set
    // $pull removes friend from set
  updateUserFriends: function (idQuery, friend, method, cb) {
    console.log('inserting friend into db', idQuery)
    if (method === 'add') {
      var actionQuery = {'$addToSet': {friends: friend}};
    } else {
      var actionQuery = {'$pull': {friends: friend}};
      console.log('actionQuery',actionQuery)
    }
    User.update(idQuery, actionQuery, function (err, result) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, result);
    });
  },

  //Add event to database
  addEventToDb: function(eventObj, cb) {
    Event.create(eventObj, function(err, result){
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, result);
    });
  },

  //Get active events from database
  getActiveEvents: function(cb) {
    //var query = {'active': true};
    var query = {};
    Event.find(query, function(err, events) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, events);
    });
  },

  //Get events by user ID
  getEventById: function(id, cb) {
    Event.findById(id, function(err, event) {
      if(err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, event);
    });
  },

  //Set event active status to false based on current time and time ended
  expireEvents: function(cb) {
    var currentTime = new Date(Date.now());

    //Get all events where endedAt is less than current time
    var query = {'endedAt': {'$lt': currentTime}};

    var data = {
        $set: {
          active: false
        }
    }

    //Update all events where endedAt is less than current time
    Event.update(query, data, {multi: true}, function(err, results) { 
      if (err) {
        console.log('Error expiring events: ',err);
      }
    });
  }
}

module.exports = utils;

