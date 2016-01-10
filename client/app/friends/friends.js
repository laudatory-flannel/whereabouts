//used purely for testing - production code will not utilize a default user
var DEFAULT_USER = {
  _id: '12345',
  name: 'User McUser'
};

angular.module('greenfield.friends', ['greenfield.services'])
.controller('FriendsController', function ($scope, localStorage, HTTP) {
  $scope.user = localStorage.get('flannel.user') || DEFAULT_USER;
  $scope.endpointUrl = '/users/' + $scope.user._id + '/friends';
  $scope.friends = [];
  $scope.users = [];

  $scope.add = function(friendId) {
    HTTP.sendRequest('POST', $scope.endpointUrl)
    .then(function(response) {
      $scope.getAll();
    });
  };

  $scope.getAllFriends = function() {
    HTTP.sendRequest('GET', $scope.endpointUrl)
    .then(function(response) {
      if (response.data) {
        $scope.friends = response.data;
      }
    })
  };

  $scope.getAllUsers = function() {
    HTTP.sendRequest('GET', '/users')
    .then(function(response) {
      $scope.users = response.data;
    });
  };

  $scope.getAllFriends();
  $scope.getAllUsers();
});