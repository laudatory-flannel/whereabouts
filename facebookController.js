homeModule.controller('facebookController', function($scope) {
  $scope.initialize = function() {
    //initialize facebook stuff for authentication/api
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

  $scope.getUserData = function() {
    FB.api('/me', function(response) {
      console.log("user info:", response);
      $scope.getFriendLists();
    })
  };

  $scope.getFriendLists = function(authResponse) {
    FB.api("/me/friends?access_token=" + authResponse, function(response) {
      console.log("friend list:", response);
    });
  };

  $scope.getAuthResponse = function() {
    console.log('running this');
    FB.getAuthResponse(function(response) {
      console.log("auth response:", response);
    });
  };

  $scope.login = function() {
    FB.getLoginStatus(function(response) {
      console.log(response)
      if (response.status === 'connected') {
        console.log('Logged in.');
        $scope.getUserData(response.authResponse);
        //$scope.getAuthResponse();
      }
      else {
        FB.login();
      }
    });
  };

  $scope.logout = function() {
    FB.logout();
  };

  $scope.initialize();
});