angular.module('greenfield', [
  'greenfield.auth',
  'greenfield.event',
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

})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/auth');
    }
  });
});