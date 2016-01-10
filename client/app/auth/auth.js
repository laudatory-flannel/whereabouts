angular.module('greenfield.auth', ['greenfield.services'])
.controller('AuthController', function($scope, $location, Facebook, Auth) {
  $scope.login = function() {
    var loginToApp = function(accessToken, userName) {
      Auth.login({
        accessToken: accessToken,
        userName: userName
      })
      .then(function(response) {
        //should do some check of response statusCode etc. to confirm successful login
        $location.path('/home');
      });
    };

    if (Auth.isAuth()) {
      $location.path('/home');
    } else {
      Facebook.login(function(loginResponse) {
        Facebook.getUserData(function(userDataResponse) {
          var accessToken = loginResponse.authResponse.accessToken;
          var userName = userDataResponse.name;
          loginToApp(accessToken, userName);
        });
      });
    }
  };

  $scope.logout = function() {
    if (Auth.isAuth()) {
      Auth.logout();
      $location.path('/auth');
      Facebook.logout(function() {});
    }
  }
});