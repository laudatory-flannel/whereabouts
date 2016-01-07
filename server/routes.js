//var bodyParser = require('body-parser');

module.exports = function(app, express){
	app.use('/', express.static('../Client'));
};