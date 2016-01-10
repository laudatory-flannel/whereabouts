var JWT_SECRET = 'candyvan';
// currently insecure since this is posted on github
// we'll change it later, ya rascals!

var jwt = require('jwt-simple');

// Used for debugging, to check if x-access-token is present
// Not generally necessary
exports.requestLogger = function(req, res, next) {
  console.log(req.path, req.headers['x-access-token']);
  next();
};

exports.authenticate = function(req, res, next) {
  try {
    var token = req.headers['x-access-token'];
    if (!token) {
      return res.send(403); // Forbidden
    }
    var user = jwt.decode(token, JWT_SECRET);
    req.user = user;
    //console.log("middleware authenticated user:", user);
    next();
  } catch (error) {
    return next(error);
  }
};

exports.errorLogger = function(error, req, res, next) {
  console.error(error.stack);
  next(error);
};

exports.errorHandler = function(error, req, res, next) {
  res.send(500, { error: error.message });
};