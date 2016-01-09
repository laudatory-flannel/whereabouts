//used purely for testing - production code will not utilize a default user
var DEFAULT_USER = {
  _id: '12345',
  name: 'User McUser'
};

angular.module('greenfield.friends', ['greenfield.services'])
.controller('FriendsController', function ($scope, localStorage, HTTP) {
  $scope.user = localStorage.get('flannel.user') || DEFAULT_USER;
  $scope.friends = [];

  $scope.getAll = function() {
    var url = '/users/' + $scope.user._id + '/friends';
    HTTP.sendRequest('GET', url)
    .then(function(response){
      if (response.data) {
        $scope.friends = response.data;
      }
    })
  };
});