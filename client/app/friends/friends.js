//used purely for testing - production code will not utilize a default user
var DEFAULT_USER = {
  _id: "569330315d957f2fd73cd7e2",
  name: 'Rachel',
  friends: []
};

angular.module('greenfield.friends', ['greenfield.services'])
.factory('Friends', function ($http) {

  var modifyFriend = function (user, friend, action) {
    console.log('modifying friend', user._id)
    data = {
      friend: friend,
      action: action
    }
    return $http({
      method: 'POST',
      url: '/users/' + user._id + '/friends',
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
.controller('FriendsController', function ($scope, localStorage, HTTP, Friends) {
  $scope.user = localStorage.get('flannel.user') || DEFAULT_USER;
  $scope.friends = [];
  $scope.users = [];

  $scope.addFriend = function(friend) {
    console.log('calling $scope.addFriend', friend)
    $scope.search = null;
    Friends.modifyFriend($scope.user, friend, 'add')
    .then(function(data) {
      $scope.friends.push(friend);
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