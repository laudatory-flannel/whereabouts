//used purely for testing - production code will not utilize a default user
var DEFAULT_USER = {
  _id: '1',
  name: 'Rachel',
};

angular.module('greenfield.friends', ['greenfield.services'])
.controller('FriendsController', function ($scope, localStorage, HTTP, Friends) {
  $scope.user = localStorage.get('flannel.user') || DEFAULT_USER;
  $scope.friends = [];
  $scope.users = [];
  $scope.friendAdded = false;

  $scope.addFriend = function(friendName) {
    Friends.addFriend(friendName)
    .then(function(data) {
      $scope.friendAdded = true;
    });
  };

  $scope.getAllFriends = function() {
    Friends.getAllFriends($scope.user.name)
    .then(function(result) {
      $scope.friends = result.data;
    });
  };

  $scope.getAllUsers = function() {
    Friends.getAllUsers()
    .then(function(result) {
      $scope.users = result.data;
    });
  };

  $scope.getAllFriends();
  $scope.getAllUsers();
});