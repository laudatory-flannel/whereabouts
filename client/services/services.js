angular.module('greenfield.services', [])
//example factory
.factory('services', function ($http) {
  var example = function () {

  };
  return {
    example: example
  };
})
//factory that simplifies get/set with $window.localStorage
.factory('localStorage', function($window) {
  var get = function(key) {
    return $window.localStorage.getItem(key);
  };
  var set = function(key, value) {
    return $window.localStorage.setItem(key, value);
  };
  return {
    get: get,
    set: set
  };
})
.factory('HTTP', function($http) {
  var sendRequest = function(method, url, data) {
    var options = {
      method: method,
      url: url
    };
    if (data) {
      options.data = data;
    }
    return $http(options);
  };

  return {
    sendRequest: sendRequest
  };
})
.factory('Friends', function ($http) {

  var addFriend = function (input) {

    return $http({
      method: 'POST',
      url: '/users/' + input + '/friends',
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
    addFriend: addFriend,
    getAllFriends: getAllFriends,
    getAllUsers: getAllUsers
  };
});