var mongoose = require('../config/database');

var EventSchema = new mongoose.Schema({
 // _id: no need to include _id in schema, should auto  http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
 title: String,
 description: String,
 user: String, // just the user's name, at least for now (easier to show it in view)
 userID: String,
 createdAt: { type: Date, default: new Date(Date.now()) },
 endedAt: { type: Date, default: new Date(Date.now()) },
 active: Boolean,
 isPublic: Boolean,
 // More info on location data types http://cannoneyed.github.io/geojson/
 location: {
    type: { 
      type: String,
      default: 'Point'
    }, 
    coordinates: [Number]
  } 
});

EventSchema.index({ location : '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);
