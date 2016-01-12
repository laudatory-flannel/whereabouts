angular.module('greenfield', [
  'greenfield.services',
  'greenfield.auth',
  'greenfield.friends',
  'greenfield.home',
  'ngRoute'])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      authenticate: true
    })
    .when('/event', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController',
      authenticate: true
    })
    .when('/friends', {
      templateUrl: 'app/friends/friends.html',
      controller: 'FriendsController',
      authenticate: true
    })
    .otherwise( {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    });

    // Attaches x-access-token to outgoing AJAX requests
    // Unclear why, but does not apply to auxiliary static files requested from server
    $httpProvider.interceptors.push('AttachTokens'); 
})
.factory('AttachTokens', function(localStorage) {
  var attach = {
    request: function(req) {
      var token = localStorage.get('flannel.token');
      if (token) {
        req.headers['x-access-token'] = token;
      }
      req.headers['Allow-Control-Allow-Origin'] = '*'; // unclear if necessary
      return req;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/auth');
    }
  });
});