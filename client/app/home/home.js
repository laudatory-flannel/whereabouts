// .controller('HomeController', function ($scope, $window, $location, Services) {
   
// });

// random default location in Berkeley, CA
var DEFAULT_POSITION = [ 30, -120 ];

angular.module('greenfield.home', ['greenfield.services'])
.controller('HomeController', function($scope, localStorage, $http) {
  $scope.map; // google map object
  $scope.loading; // boolean for whether map is loading
  $scope.position = [ null, null ]; // 2-tuple of [ latitude, longitude ]
  $scope.allEvents;

  // Sets $scope position
  $scope.setScopePosition = function(position) {
    $scope.position[0] = position[0] || DEFAULT_POSITION[0];
    $scope.position[1] = position[1] || DEFAULT_POSITION[1];
  };
  
  // Gets/Sets position from localStorage
  // Allows for faster load of map, since using getRealLocation can take a few seconds 
  $scope.getLocalPosition = function() {
    return [ parseFloat(localStorage.get('flannel.latitude')),
             parseFloat(localStorage.get('flannel.longitude')) ];
  };
  $scope.setLocalPosition = function (position){
    localStorage.set('flannel.latitude', position[0]);
    localStorage.set('flannel.longitude', position[1]);
  };

  $scope.findEvents = function(){
    $http.get('/events').success(function(data, status, headers, config) {
      $scope.allEvents = data;
    }).
    error(function(data, status, headers, config) {
      console.log('There was an error with your get request');
    });
  };

  // Gets actual position, passes to callback
  $scope.getRealLocation = function(callback) {
    var successCallback = function(positionObj) {
      // positionObj's format is native to navigator.geolocation.getCurrentPosition
      var position = [ positionObj.coords.latitude, positionObj.coords.longitude ];
      callback(position);
    };
    var errorCallback = function(error) {
      console.log("Failed to get geolocation:", error.code);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  // Renders map in $('#map') DOM element, based on $scope position
  $scope.renderMap = function() {
    $scope.$apply(function() {
      // $apply notifies angular to watch changes and re-evaluate ng-if/show expressions
      $scope.loading = false;
    });
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: $scope.position[0], lng: $scope.position[1]},
      zoom: 14,
      minZoom: 14,
      maxZoom: 14,
      draggable: false,
      // scrollwheel: false,
      disableDefaultUI: true,
      styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
    });

  $scope.findEvents();

    var myLocations = [
      ['<h4> My People</h4>', 37.793686, -122.401268],
      ['<h4>My People</h4>', 37.789911, -122.402327],
    ];

    var infowindow = new google.maps.InfoWindow({maxWidth: 160});
    for (var i = 0; i < myLocations.length; i++) {  
      var postMarker = new google.maps.Marker({
        position: new google.maps.LatLng(37.781950, -122.418097), 
        animation: google.maps.Animation.DROP,
        map: $scope.map,
      });
      
      google.maps.event.addListener(postMarker, 'click', (function(postMarker, i) {
        return function() {
          infowindow.setContent(myLocations[i][0]);
          infowindow.open($scope.map, postMarker);
        };
      })(postMarker, i));
    }
  };


  $scope.initMap = function() {
    $scope.loading = true;
    
    // Render a possibly-reasonable guess for the location
    //$scope.setScopePosition($scope.getLocalPosition());
    //$scope.renderMap();

    // Render the actual location, once it is found
    $scope.getRealLocation(function(position) {
      $scope.setScopePosition(position);
      $scope.setLocalPosition(position);
      $scope.renderMap();
    });
  };

  $scope.initMap();




});