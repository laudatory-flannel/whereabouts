var mongoose = require('mongoose');

// production database
// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/');

mongoose.connect('mongodb://localhost/');

module.exports = mongoose;