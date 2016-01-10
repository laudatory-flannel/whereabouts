angular.module('greenfield.services', [])
// Simplifies interaction with browser's local storage
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
// Simplifies interaction with $http
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
})
// Provides Facebook authentication-related functionality
.factory('Facebook', function() {
  // Initializes Facebook api caller (boilerplate code provided directly by Facebook)
  var initialize = function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '993093684087607',
        xfbml      : true,
        version    : 'v2.5'
      });
    };

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  var login = function(successCallback) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('already logged in:', response);
        successCallback(response);
      }
      else {
        console.log('attempting login...');
        FB.login(function(response) {
          if (response.status === 'connected') {
            console.log('successful login:', response);
            successCallback(response);
          } else {
            console.log('failed login:', response);
          }
        });
      }
    });
  };

  var logout = function() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('attempting logout...');
        FB.logout(function(response) {
          if (response.status === 'unknown') {
            console.log('successful logout:', response);
          } else {
            console.log('failed logout:', response);
          }
        });
      } else {
        console.log('already logged out:', response);
      }
    });
  };

  var getUserData = function(successCallback) {
    FB.api('/me', function(response) {
      //console.log('user info:', response);
      successCallback(response);
    });
  };

  // This code does not work, due to Facebook tightening access to friend lists
  // var getFriendLists = function(authResponse) {
  //   FB.api('/me/friends', function(response) {
  //     console.log("friend list:", response);
  //   });
  // };

  initialize(); // this is probably asynchronous and should be handled more appropriately

  return {
    login: login,
    logout: logout,
    getUserData: getUserData
  };
});