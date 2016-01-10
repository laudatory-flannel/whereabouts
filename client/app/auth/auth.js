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

    Facebook.login(function(loginResponse) {
      Facebook.getUserData(function(userDataResponse) {
        var accessToken = loginResponse.authResponse.accessToken;
        var userName = userDataResponse.name;
        loginToApp(accessToken, userName);
      });
    });
  };

  $scope.logout = function() {
    Facebook.logout(function() {
      Auth.logout();
      $location.path('/auth');
    });
  }
});