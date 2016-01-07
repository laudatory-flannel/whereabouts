angular.module('facebook', [])
.controller('facebookController', function($scope, $window) {
  $scope.getUserData = function() {
    FB.api('/me', function(response) {
      console.log("user info:", response);
      $scope.getFriendLists();
    })
  };
  $scope.getFriendLists = function(authResponse) {
    FB.api("/me/friends?access_token=" + authResponse, function(response) {
      console.log("friend list:", response);
    });
  };
  $scope.getAuthResponse = function() {
    console.log('running this');
    FB.getAuthResponse(function(response) {
      console.log("auth response:", response);
    });
  };
  $scope.login = function() {
    FB.getLoginStatus(function(response) {
      console.log(response)
      if (response.status === 'connected') {
        console.log('Logged in.');
        $scope.getUserData(response.authResponse);
        //$scope.getAuthResponse();
      }
      else {
        FB.login();
      }
    });
  };
  $scope.logout = function() {
    FB.logout();
  };
});