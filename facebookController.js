angular.module('facebook', [])
.controller('facebookController', function($scope) {
  $scope.login = function() {
    FB.getLoginStatus(function(response) {
      console.log(response)
      if (response.status === 'connected') {
        console.log('Logged in.');
      }
      else {
        FB.login();
      }
    });
  };
});