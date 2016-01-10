angular.module('greenfield.auth', ['greenfield.services'])
.controller('AuthController', function($scope, $location, Facebook, Auth) {
  $scope.login = function() {
    if (Auth.isAuth()) {
      console.log('already logged in to app');
      $location.path('/home');
    } else {
      Facebook.login(function(loginResponse) {
        Facebook.getUserData(function(userDataResponse) {
          var accessToken = loginResponse.authResponse.accessToken;
          var userName = userDataResponse.name;
          Auth.login({ accessToken: accessToken, userName: userName });
        });
      });
    }
  };

  $scope.logout = function() {
    if (Auth.isAuth()) {
      Auth.logout();
      $location.path('/auth');
      Facebook.logout(function() {});
    } else {
      console.log('already logged out of app');
    }
  }
});