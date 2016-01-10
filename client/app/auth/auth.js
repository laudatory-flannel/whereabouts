angular.module('greenfield.auth', ['greenfield.services'])
.controller('AuthController', function($scope, HTTP) {
  // Initialize Facebook api caller
  // This is boilerplate code provided directly by Facebook
  $scope.initialize = function() {
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

  // $scope.getFriendLists = function(authResponse) {
  //   FB.api("/me/friends?access_token=" + authResponse, function(response) {
  //     console.log("friend list:", response);
  //   });
  // };

  // $scope.getAuthResponse = function() {
  //   console.log('running this');
  //   FB.getAuthResponse(function(response) {
  //     console.log("auth response:", response);
  //   });
  // };

  $scope.login = function() {
    var getUserData = function(callback) {
      FB.api('/me', function(response) {
        console.log("user info:", response);
        callback(response);
      });
    };

    var loginToApp = function(response) {
      getUserData(function(userDataResponse) {
        var accessToken = response.authResponse.accessToken;
        var userName = userDataResponse.name;
        HTTP.sendRequest('POST', '/auth', { accessToken: accessToken, userName: userName });
      });
    };

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('already logged in:', response);
        loginToApp(response);
        //$scope.getUserData(response.authResponse);
      }
      else {
        console.log('attempting login...');
        FB.login(function(response) {
          if (response.status === 'connected') {
            console.log('successful login:', response);
            loginToApp(response);
          } else {
            console.log('failed login:', response);
          }
        });
      }
    });
  };

  $scope.logout = function() {
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

  $scope.initialize();
});