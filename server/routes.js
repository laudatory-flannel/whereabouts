var JWT_SECRET = 'candyvan';
// currently insecure since this is posted on github
// we'll change it later, ya rascals!

var bodyParser = require('body-parser');
var helpers = require('./controllers/helpers.js');
var middleware = require('./middleware.js');
var request = require('request');
var FormData = require('form-data');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId; 


module.exports = function(app, express) {
	// Allow app to parse request body (for POST requests)
	app.use(bodyParser.urlencoded({extended: true})); // unsure if necessary
  app.use(bodyParser.json());

  // app.use(middleware.requestLogger);
  app.use(express.static(__dirname + '/../client'));

  // Adds authentication for all protected endpoints
  // Developer can comment out temporarily for testing purposes
	app.use('/events', middleware.authenticate);
	app.use('/users', middleware.authenticate);

	// ---- GET REQUESTS ----
	// Get events
	app.get('/events', function(req, res){
		helpers.getActiveEvents(function(err, data){
			if (err) {
				res.send(500);
			} else {
				res.json(data);
			}
		});
	});

	// Get users
	app.get('/users', function(req, res){
		helpers.getUsers(function(err, data){
			if (err) {
				res.send(500);
			} else {
				res.json(data);
			}
		});
	});

	// Get event by id
	app.get('/events/:id', function(req, res){
		helpers.getEventById(req.params.id, function(err, data) {
			if (err) {
				res.send(500);
			} else {
				res.json(data);
			}
		});
	});

	// // Get users' friends array
	// app.get('/users/:id/friends', function(req, res){
	// 	helpers.getUserById(req.params.id, function(err, data) {
	// 		if (err) {
	// 			res.send(500);
	// 		} else {
	// 			res.json(data.friends);
	// 		}
	// 	})
	// });

	// Get users' friends array
	app.get('/users/:name/friends', function(req, res){
		helpers.getUserByName(req.params.name, function(err, data) {
			if (err) {
				res.send(500);
			} else {
				res.json(data.friends);
			}
		})
	});

	// ---- POST REQUESTS ----
	//Logging in/authentication
	app.post('/auth', function(req, res){
		var accessToken = req.body.accessToken;
		var userName = req.body.userName;

		// Check if access token is valid by attempting to call Facebook api with it
		var form = new FormData();
		form.append('access_token', accessToken);
		form.submit('https://graph.facebook.com/v2.5/me', function(err, fbRes) {
			// If valid, find or create the user by name (can later adjust this to use fb id)
			// and return the user as a jwt
			var result = '';
			fbRes.on('data', function(chunk) {
				result += chunk;
			})
			fbRes.on('end', function() {
				var body = JSON.parse(result);
				if (body.success) { // Facebook returns this only if valid
				console.log("valid facebook token");
				helpers.getUserByName(userName, function(err, user) {
					if (user) {
						console.log("found existing user:", user);
						res.json({ token: jwt.encode(user, JWT_SECRET) });
					} else {
						helpers.addUserToDb({ name: userName }, function(err, user) {
							if (err) {
								res.send(500);
							} else {
								console.log("created new user:", user);
								res.json({ token: jwt.encode(user, JWT_SECRET) });
							}
						});
					}
				});
			// Else redirect
			} else {
				console.log("invalid facebook token");
				res.redirect('/#/auth');
			}
			})
		});
	});

	//Add new friend to user's friends.
	app.post('/users/:id/friends', function(req, res) {
		helpers.updateUserFriends(req.params.id, req.body, '$push', function (err, data) {
			if (err) {
				res.send(500);
			} else {
				res.json(data);
			}
		});
	});

	app.post('/checkAuth', function(req, res, next) {
		var token = req.body.token;
		if (!token) {
			next(new Error('No token'));
		}
		var user = jwt.decode(token, JWT_SECRET);
		helpers.getUserByName(user.name, function(err, user) {
			if (err) {
				res.send(500);
			} else if (user) {
				res.send(200);
			} else {
				res.send(401);
			}
		});
	});

	//Posting new event
	app.post('/events', function(req, res){
		helpers.addEventToDb(req.body, function(err, result) {
			if (err) {
				res.send(500);
			} else {
				res.json(result);
			}
		});
	});

	// Handles errors (from middleware.authentication)
	app.use(middleware.errorLogger);
	app.use(middleware.errorHandler);
};