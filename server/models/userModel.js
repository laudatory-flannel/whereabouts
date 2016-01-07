var mongoose = require('../config/db');

var UserSchema = new mongoose.Schema({
  // _id: no need to include _id in schema, should auto generate http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
 name: String,
 fb_id: String,
 friends: [String],
});
