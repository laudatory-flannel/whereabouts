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

  // This code does not work, due to Facebook tightening access to friend lists
  // $scope.getFriendLists = function(authResponse) {
  //   FB.api('/me/friends', function(response) {
  //     console.log("friend list:", response);
  //   });
  // };

  $scope.login = function() {
    var loginToFacebook = function(successCallback) {
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

    var getFacebookUserData = function(successCallback) {
      FB.api('/me', function(response) {
        //console.log('user info:', response);
        successCallback(response);
      });
    };

    var loginToApp = function(accessToken, userName) {
      HTTP.sendRequest('POST', '/auth', {
        accessToken: accessToken,
        userName: userName
      });
    };

    loginToFacebook(function(loginResponse) {
      getFacebookUserData(function(userDataResponse) {
        var accessToken = loginResponse.authResponse.accessToken;
        var userName = userDataResponse.name;
        loginToApp(accessToken, userName);
      });
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