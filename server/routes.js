var bodyparser = require('body-parser');
var database = require('./config/database.js');
<<<<<<< HEAD
var jwt = require('jwt-simple');
=======
>>>>>>> 681ac8fd5728e5528da9b4fd56bd24350a512097


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
<<<<<<< HEAD
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
=======
		database.addUserToDb(req.body, function(err, result){
			if(err){
				console.log(err);
				res.status(500);
				res.redirect('/home');
			} else {
				res.redirect('/home');
			}
		});
>>>>>>> 681ac8fd5728e5528da9b4fd56bd24350a512097
		res.redirect('/auth');
	});

	//Logging in/authentication
<<<<<<< HEAD
	app.post('/events', function(req, res){
		//AUTHENTICATION HERE
		//if auth
=======
	app.post('/event', function(req, res){
		//AUTHENTICATION HERE
>>>>>>> 681ac8fd5728e5528da9b4fd56bd24350a512097
		database.addEventToDb(req.body);
		res.redirect('/home');
	});

};