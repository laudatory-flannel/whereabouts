angular.module('greenfield', [])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth.html',
      controller: 'AuthController'
    })
    .when('/auth', {
      templateUrl: 'app/auth.html',
      controller: 'AuthController'
    })
    .when('/home', {
      templateUrl: 'app/home.html',
      controller: 'HomeController',
      authenticate: true
    })
    .when('/event', {
      templateUrl: 'app/event.html',
      controller: 'EventController'
      authenticate: true
    })
    .when('/logout', {
      templateUrl: 'app/auth.html',
      controller: 'AuthController'
    })
    .otherwise( {
      templateUrl: 'app/auth.html',
      controller: 'AuthController'
      authenticate: true
    });

})

.run(function () {

});
