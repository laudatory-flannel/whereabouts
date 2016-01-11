//used purely for testing - production code will not utilize a default user
var DEFAULT_USER = {
  _id: "569301b92951990b21a1f28c",
  name: 'Rachel',
};

angular.module('greenfield.friends', ['greenfield.services'])
.controller('FriendsController', function ($scope, localStorage, HTTP, Friends) {
  $scope.user = localStorage.get('flannel.user') || DEFAULT_USER;
  $scope.friends = [];
  $scope.users = [];

  $scope.addFriend = function(friend) {
    $scope.search = null;
    Friends.modifyFriend($scope.user, friend, 'add')
    .then(function(data) {
      $scope.friends.push(friend);
      console.log($scope.friends)
    });
  };

  $scope.getAllFriends = function() {
    Friends.getAllFriends($scope.user._id)
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

  $scope.deleteFriend = function(friend) {
   Friends.modifyFriend($scope.user, friend, 'delete')
   .then(function(data) {
     for (var i = 0; i < $scope.friends.length; i++) {
      if ($scope.friends[i] === friend) {
        $scope.friends.splice(i, 1);
      }
     }
   });
  };

  $scope.getAllFriends();
  $scope.getAllUsers();
});