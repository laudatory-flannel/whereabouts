var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
  location: 
});

LocationSchema.index({ location : '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);
