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
});