var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	mongoose.connect('mongodb://localhost:27017/greenfield');
} else if (env === 'testing') {
	mongoose.connect('mongodb://localhost:27017/greenfield-test');
} else {
	mongoose.connect('mongodb://user:hr37@ds039135.mongolab.com:39135/laudatory-flannel');
};


module.exports = mongoose;