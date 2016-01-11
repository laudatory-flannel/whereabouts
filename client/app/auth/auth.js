angular.module('greenfield.auth', ['greenfield.services'])
.controller('AuthController', function($scope, Auth) {
  $scope.login = Auth.login;
  $scope.logout = Auth.logout;
  $scope.isLandingPage = true;
});