angular.module('services', [])
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