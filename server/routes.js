var bodyparser = require('body-parser');
var helpers = require('./controllers/helpers.js');
var jwt = require('jwt-simple');


module.exports = function(app, express) {
	app.use('/', express.static('../Client'));
// Get requests
	app.get('/events', function(req, res){
		helpers.getActiveEvents(function(err, data){
			if (err) {
				console.log(err);
			}
			res.json(data);
		});
	});


// Post requests
	//Posting new event
	app.post('/auth', function(req, res){
		// if logged in with facebook
		//create token

		// what is being sent from the client?
		var user = req.body; //?
		var token = jwt.encode(user, 'candyvan');

		helpers.getUserByName(user.name, function(err, result){
			if(result === null || result.length === 0){
				helpers.addUserToDb(user, function(err, result){
					if(err){
						console.log(err);
						res.status(500);
						res.json(result);
					} else {
						res.json({token: token});
					}
				});
			} else {
				res.json({token: token});
			}
		});
		// else redirect
	});

	//Logging in/authentication
	app.post('/events', function(req, res){
		//AUTHENTICATION HERE
		//if auth
		helpers.addEventToDb(req.body, function(err, result) {
			if (err) {
				console.log(err);
				res.status(500);
			}
			res.json(result);`
		});
	});

};