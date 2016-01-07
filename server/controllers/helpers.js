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

  // input event to db
  addEventToDb: function(eventObj) {
    var query = {'title':eventObj.title};
    var data = {
        $set: {
          eventObj
        }
    }

    Event.findOneAndUpdate(query, data, {upsert:true, 'new': true}, function(err, result){
      if (err) {
        console.log(err);
        return res.send(500, { error: err });
      }
    });
  },

  // get active events
  getActiveEvents: function() {
    var query = {'active': true};
    return Event.find(query, function(err, events){
      if (err) {
        console.log(err);
        return res.send(500, { error: err });
      }
    });

  },

  // handle event expiration
  expireEvents: function() {
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
      } else {
        console.log('active events updated!');
      }
    });

  }
}

module.exports = utils;

