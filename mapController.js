//random default location: in Berkeley, CA
var DEFAULT_LATITUDE = 30;
var DEFAULT_LONGITUDE = -120;

homeModule.controller('mapController', function($scope, localStorage) {
  $scope.map;

  $scope.getLocationLocally = function() {
    $scope.latitude = parseFloat(localStorage.get('flannel.latitude')) || DEFAULT_LATITUDE;
    $scope.longitude = parseFloat(localStorage.get('flannel.longitude')) || DEFAULT_LONGITUDE;
    // console.log("got location locally:", $scope.latitude, $scope.longitude);
  };

  $scope.storeLocationLocally = function (latitude, longitude){
    localStorage.set('flannel.latitude', latitude);
    localStorage.set('flannel.longitude', longitude);
  };

  $scope.getLocationActually = function(callback) {
    var successCallback = function(position) {
      $scope.latitude = position.coords.latitude;
      $scope.longitude = position.coords.longitude;
      // console.log("got location actually:", $scope.latitude, $scope.longitude);
      $scope.storeLocationLocally($scope.latitude, $scope.longitude);
      callback();
    };
    var errorCallback = function(error) {
      console.log("Failed to get geolocation:", error.code);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  $scope.renderMap = function() {
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: $scope.latitude, lng: $scope.longitude},
      zoom: 14,
      minZoom: 14,
      maxZoom: 14,
      draggable: false,
      // scrollwheel: false,
      disableDefaultUI: true,
      styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
    });
  }

  $scope.initMap = function() {
    //first render a guess for the location
    $scope.getLocationLocally();
    $scope.renderMap();

    //then render the actual location once it is read (since it may take a couple seconds)
    $scope.getLocationActually($scope.renderMap);
  };

  $scope.initMap();
});