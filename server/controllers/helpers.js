var User = require('../models/userModel.js');
var Event = require('../models/eventModel.js');

var utils = {

  // add user to db -- Verified
  addUserToDb: function(userObj, cb) {
    var query = {'name':userObj.name};
    var data = {
        $set: {
          userObj
        }
    }

    User.findOneAndUpdate(query, data, {upsert:true, 'new': true}, function(err, result){
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, result);
    });
  },

  // get user based on name -- Verified
  getUserByName: function(name, cb) {
    var query = {'name': name};
    User.findOne(query, function(err, result) {
      if (err) {
        console.log(err);
        return res.send(500, { error: err });
      }
      return cb(null, result);
    });
  },

  // input event to db -- Verified
  addEventToDb: function(eventObj, cb) {

    Event.create(eventObj, function(err, result){
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, result);
    });
  },

  // get active events
  getActiveEvents: function(cb) {
    var query = {'active': true};
    Event.find(query, function(err, events){
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, events);
    });

  },

  // handle event expiration
  expireEvents: function(cb) {
    var currentTime = new Date(Date.now());

    // grabs all events where endedAt is less than current time
    var query = {'endedAt': {'$lt': currentTime}};

    var data = {
        $set: {
          active: false
        }
    }

    Event.update(query, data, {multi: true}, function(err, results) { // may need upsert or new options
      if (err) {
        console.log(err);
        return cb(err);
      } 
      return cb(null, results);
    });

  }
}

module.exports = utils;

