var USER_ICON_URL = 'app/home/currentlocation.png';
var EVENT_ICON_URL = 'app/home/peace.png';
var DEFAULT_POSITION = [ 37.784, -122.409 ]; // Hack Reactor

angular.module('greenfield.home', ['greenfield.services'])
.factory('Map', function(localStorage) {
  // position is a 2-tuple of [ latitude, longitude ]

  // Gets/Sets position from localStorage
  // Allows for faster load of map, since using getRealLocation can take a few seconds 
  var getLocalPosition = function() {
    return [ parseFloat(localStorage.get('flannel.latitude')),
             parseFloat(localStorage.get('flannel.longitude')) ];
  };
  var setLocalPosition = function (position){
    localStorage.set('flannel.latitude', position[0]);
    localStorage.set('flannel.longitude', position[1]);
  };

  // Gets actual position, passes to callback
  var getRealLocation = function(callback) {
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
  var render = function(position) {
    return new google.maps.Map(document.getElementById('map'), {
      center: { lat: position[0], lng: position[1] },
      zoom: 14,
      minZoom: 14,
      maxZoom: 14,
      draggable: false,
      // scrollwheel: false,
      disableDefaultUI: true,
      styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
    });
  };

  return {
    getLocalPosition: getLocalPosition,
    setLocalPosition: setLocalPosition,
    getRealLocation: getRealLocation,
    render: render
  };
})
.factory('Directions', function() {
  var display = new google.maps.DirectionsRenderer({ draggable: true });
  var service = new google.maps.DirectionsService();

  var displayRoute = function(map) {
    display.setMap(map);
    display.setPanel(document.getElementById("directions"));
    service.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  };

  return {
    displayRoute: displayRoute
  };
})
.factory('Markers', function() {
  return {};
})
.controller('HomeController', function($scope, Map, Directions, Markers, HTTP) {
  $scope.map; // google map object

  $scope.setUpRoutes = function() {
    // Sets visibility of directions box (should likely be renamed for clarity)
    $scope.boxAppear = false;

    var displayRouteHandler = function() {
      $scope.$apply(function() {
        $scope.boxAppear = true;
      });
      Directions.displayRoute($scope.map);
    }

    // Register event listeners to display route whenever endpoints change
    document.getElementById('start').addEventListener('change', displayRouteHandler);
    document.getElementById('end').addEventListener('change', displayRouteHandler);
  };

  $scope.setUpMarkers = function() {
    $scope.allEvents;
    $scope.allLocations;
    $scope.postMarker = [];

    // Not being utilized yet
    $scope.findEvents();

    // Populated with dummy data for now - should eventually get data from $scope.allEvents
    $scope.allLocations = [
    {
      id: 1,
      personname: "Greg Domorski",
      description: "I'm at Starbucks Bros!",
      timeuntil: "8 p.m.",
      latitude: 37.793686,
      longitude: -122.401268
    },
    {
      id: 2,
      personname: "Max O'Connell",
      description: "I'm at SF GreenSpace HACKING! YEAH HACK REACTOR",
      timeuntil: "10 p.m.",
      latitude: 37.786710,
      longitude: -122.400831
    },
    {
      id: 3,
      personname: "Gloria Ma",
      description: "I'm  hanging out at the Hyatt!! Come join me",
      timeuntil: "8 p.m.",
      latitude: 37.794301,
      longitude: -122.39573
    },
    {
      id: 4,
      personname: "Rachel RoseFigura",
      description: "I'm at Starbucks Bros!",
      timeuntil: "8 p.m.",
      latitude: 37.784118,
      longitude: -122.406435
    },    
    ];

    var infowindow = new google.maps.InfoWindow({ maxWidth: 160 });
    var postMarker;

    // Adds marker to map (and returns the marker)
    var addMarker = function(position, iconUrl) {
      return new google.maps.Marker({
        position: new google.maps.LatLng(position[0], position[1]), 
        animation: google.maps.Animation.DROP,
        map: $scope.map,
        icon: iconUrl
      });
    };

    // Add marker for user
    addMarker(Map.getLocalPosition(), USER_ICON_URL);

    // Add clickable map marker for each location
    for (var i = 0; i < $scope.allLocations.length; i++) {
      var location = $scope.allLocations[i];
      var marker = addMarker([ location.latitude, location.longitude ], EVENT_ICON_URL);
      $scope.postMarker.push(marker);
      
      google.maps.event.addListener($scope.postMarker[i], 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(
            "<h4>" + $scope.allLocations[i].personname +
            "</h4>" + $scope.allLocations[i].description + 
            "<p>Will be there until " + $scope.allLocations[i].timeuntil + "</p>");
          infowindow.open($scope.map, marker);
        };
      })($scope.postMarker[i], i));
    }
  };

  $scope.initMap = function(callback) {
    $scope.loading = true; // boolean to determine whether to display loading gif
    
    // Render a possibly-reasonable guess for the location
    //$scope.map = Map.render();

    // Render the actual location, once it is found
    Map.getRealLocation(function(position) {
      $scope.position = position;
      Map.setLocalPosition(position);

      $scope.$apply(function() {
        // $apply notifies angular to watch changes and re-evaluate ng-if/show expressions
        $scope.loading = false;
      });
      $scope.map = Map.render(position);
      callback();
    });
  };

  // Triggers click on marker from click on event in feed
  $scope.callMarker = function($index){
    google.maps.event.trigger($scope.postMarker[$index], 'click', 'click');
  };

  // Clears all markers from map
  $scope.clearMarkers = function() {
    for (var i = 0; i < $scope.allLocations.length; i++) {
       $scope.postMarker[i].setMap(null);
    }
  };

  // Find events - not really being used
  $scope.findEvents = function(){
    // Version using raw $http
    // $http.get('/events').success(function(data, status, headers, config) {
    //   $scope.allEvents = data;
    // }).
    // error(function(data, status, headers, config) {
    //   console.log('There was an error with your get request');
    // });
    HTTP.sendRequest('GET', '/events')
    .then(function(response) {
      $scope.allEvents = response.data;
    });
  };

  $scope.initMap(function() { //finishes asynchronously
    $scope.setUpRoutes();
    $scope.setUpMarkers();
  });


});

