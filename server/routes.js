var bodyparser = require('body-parser');
var database = require('./config/database.js');
var jwt = require('jwt-simple');


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
		// if logged in with facebook
		//create token
		var token = jwt.encode(user, 'candyvan');
		database.getUserByName(req.body.name, function(err, result){
			if(result === null){
				database.addUserToDb(req.body, function(err, result){
					if(err){
						console.log(err);
						res.status(500);
						res.redirect('/auth');
					} else {
						res.json({token: token});
					}
				});
			} else {
				res.json({token: token});
			}
		});
		// else redirect
		res.redirect('/auth');
	});

	//Logging in/authentication
	app.post('/events', function(req, res){
		//AUTHENTICATION HERE
		//if auth
		database.addEventToDb(req.body);
		res.redirect('/home');
	});

};