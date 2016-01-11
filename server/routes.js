var JWT_SECRET = 'candyvan';
// currently insecure since this is posted on github
// we'll change it later, ya rascals!

var bodyParser = require('body-parser');
var helpers = require('./controllers/helpers.js');
var middleware = require('./middleware.js');
var request = require('request');
var FormData = require('form-data');
var jwt = require('jwt-simple');
var request = require('request');

module.exports = function(app, express) {
	// Allow app to parse request body (for POST requests)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // For debugging purposes
  app.use(middleware.requestLogger);
  
  app.use(express.static(__dirname + '/../client'));

  // Adds authentication for all protected endpoints
  // Developer can comment out temporarily for testing purposes
	// app.use('/events', middleware.authenticate);
	// app.use('/users', middleware.authenticate);

	// ---- GET REQUESTS ----

	// Get events (expires inactive events and returns all active events)
	app.get('/events', function(req, res){
		helpers.expireEvents(helpers.getActiveEvents(function(err, data){
			if (err) {
				res.send(500);
			} else {
				data === null ? res.json({message: "Error: Events not found."}) : res.json(data);
			}
		}));
	});

	// Get users (returns all users)
	app.get('/users', function(req, res){
		console.log('getting users');
		helpers.getUsers(function(err, data){
			if (err) {
				res.send(500);
			} else {
				data === null ? res.json({message: "Error: Users not found."}) : res.json(data);			
			}
		});
	});

	// Get event by id 
	app.get('/events/:id', function(req, res){
		helpers.getEventById(req.params.id, function(err, data) {
			if (err) {
				res.send(500);
			} else {
				data === null ? res.json({message: "Error: Event not found."}) : res.json(data);
			}
		});
	});

	// Get users' friends array
	app.get('/users/:id/friends', function(req, res){
		console.log('successfully getting friends!')
		helpers.getUserById(req.params.id, function(err, data) {
			if (err) {
				res.send(500);
			} else {
				data === null ? res.json({message: "Error: User not found."}) : res.json(data.friends);
			}
		})
	});

	// ---- POST REQUESTS ----

	//Logging in/authentication
	app.post('/auth', function(req, res){
		var accessToken = req.body.accessToken;

		if (!accessToken) {
			console.log("no access token");
			res.send(403); // Forbidden
		}
		
		// Check if access token is valid by attempting to call Facebook api with it
		request.get('https://graph.facebook.com/v2.5/me?fields=id,name,picture.width(320).type(square),friends&access_token=' + accessToken, function(err, getResponse, fbResult) {
			if (err) {
				console.log("FB err: ", err);
				return res.send(500);
			}

			// parses user fb data into object for insertion into database
			try {
				fbResult = JSON.parse(fbResult);
				var userData = {
					fbId: fbResult.id, 
					name: fbResult.name,
					imageUrl: fbResult.picture.data.url,
					friends: fbResult.friends.data || []
				}
			} catch (e) {
				console.log("Bad friends result");
				return res.send(500);
			}

			// either returns an existing user or creates a new user if no user with that Facebook ID exists
			helpers.getOrCreateUserByFbId(userData.fbId, userData, function(err, user) {
				console.log("found existing user:", user);
				var data = {
					token: jwt.encode(user, JWT_SECRET),
					//the below should not be necessary later, but for now is an easy MVP solution
					_id: user._id,
					name: user.name
				}
				res.json(data);
			});

		});

	});

	//Add new friend to user's friends by user ID
	app.post('/users/:id/friends', function(req, res) {
		helpers.updateUserFriends({_id: req.params.id}, req.body.friend, req.body.action, function (err, data) {
			if (err) {
				res.send(500);
			} else {
				console.log('data', data)
				res.json(data);
			}
		});
	});

	//Post to check authentication
	app.post('/checkAuth', function(req, res, next) {
		var token = req.body.token;
		if (!token) {
			next(new Error('No token'));
		}
		var user = jwt.decode(token, JWT_SECRET);

		//Checks existance of user in the database and return appropriate status code
		helpers.getUserById(user.id, function(err, user) {
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