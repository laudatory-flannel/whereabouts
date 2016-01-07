var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	mongoose.connect('mongodb://localhost');
} else {
	mongoose.connect('mongodb://user:hr37@ds039135.mongolab.com:39135/laudatory-flannel');
};


module.exports = mongoose;