var bodyparser = require('body-parser');
var database = require('./config/database.js');


module.exports = function(app, express) {
	app.use('/', express.static('../Client'));
// Get requests
	app.get('/events', function(req, res){
		database.getActiveEvents().then(function(data){
			res.json(data);
		});
	});


// Post requests
	//Posting new event
	app.post('/auth', function(req, res){
		database.addUserToDb(req.body, function(err, result){
			if(err){
				console.log(err);
				res.status(500);
				res.redirect('/home');
			} else {
				res.redirect('/home');
			}
		});
		res.redirect('/auth');
	});

	//Logging in/authentication
	app.post('/event', function(req, res){
		//AUTHENTICATION HERE
		database.addEventToDb(req.body);
		res.redirect('/home');
	});

};