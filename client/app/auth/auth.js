angular.module('greenfield.auth', ['greenfield.services'])
.controller('AuthController', function($scope, HTTP, Facebook) {
  $scope.login = function() {
    var loginToApp = function(accessToken, userName) {
      HTTP.sendRequest('POST', '/auth', {
        accessToken: accessToken,
        userName: userName
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

  $scope.logout = Facebook.logout;
});