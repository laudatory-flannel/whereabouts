var mongoose = require('../config/database');

var UserSchema = new mongoose.Schema({
  // _id: no need to include _id in schema, should auto generate http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
 name: String,
 fbId: String,
 friends: [{}],
 imageUrl: String,
 description: String,
 location: {
    type: { 
      type: String,
      default: 'Point'
    }, 
    coordinates: [Number]
  }
});

UserSchema.index({ location : '2dsphere' });

module.exports = mongoose.model("User", UserSchema)
