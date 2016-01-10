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

  $scope.addFriend = function(friend) {
    Friends.addFriend($scope.user, friend)
    .then(function(data) {
      $scope.friends.push(friend._id);
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