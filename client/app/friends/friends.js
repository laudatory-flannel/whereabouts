angular.module('greenfield.friends', ['greenfield.services'])
.factory('Friends', function ($http) {

  var modifyFriend = function (userId, friend, action) {
    console.log('modifying friend', userId)
    data = {
      friend: friend,
      action: action
    }
    return $http({
      method: 'POST',
      url: '/users/' + userId + '/friends',
      data: data
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getAllFriends = function (input) {
    return $http({
      method: 'GET',
      url: '/users/' + input + '/friends',
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getAllUsers = function (input) {

    return $http({
      method: 'GET',
      url: '/users',
    })
    .then(function (resp) {
      return resp;
    });
  };

  return { 
    modifyFriend: modifyFriend,
    getAllFriends: getAllFriends,
    getAllUsers: getAllUsers
  };
})
.controller('FriendsController', function ($scope, localStorage, Friends) {
  $scope.userId = localStorage.get('flannel._id');
  $scope.friends = [];
  $scope.users = [];

  $scope.addFriend = function(friend) {
    console.log('calling $scope.addFriend', friend)
    $scope.search = null;
    Friends.modifyFriend($scope.userId, friend, 'add')
    .then(function(data) {
      $scope.friends.push(friend);
    });
  };

  $scope.getAllFriends = function() {
    Friends.getAllFriends($scope.userId)
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
   Friends.modifyFriend($scope.userId, friend, 'delete')
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