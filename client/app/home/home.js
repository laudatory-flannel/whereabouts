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
      // minZoom: 14,
      // maxZoom: 14,
      // draggable: false,
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
  // Info window object that will change content/position to display info for last marker clicked
  var infoWindow = new google.maps.InfoWindow({ maxWidth: 160 });

  // Adds marker to map (and returns the marker)
  var addMarker = function(map, position, iconUrl) {
    return new google.maps.Marker({
      position: new google.maps.LatLng(position[0], position[1]), 
      animation: google.maps.Animation.DROP,
      map: map,
      icon: iconUrl
    });
  };

  var addUserMarker = function(map, position) {
    return addMarker(map, position, USER_ICON_URL);
  }

  var addEventMarker = function(map, event) {
    var latitude = event.location.coordinates[1];
    var longitude = event.location.coordinates[0];
    var marker = addMarker(map, [latitude, longitude], EVENT_ICON_URL);
    var clickHandler = function() {
      infoWindow.setContent(
        "<h4>" + event.user +
        "</h4>" + event.description + 
        "<p>Will be there until " + event.endedAt + "</p>");
      infoWindow.open(map, marker);
    };
    google.maps.event.addListener(marker, 'click', clickHandler);
    return marker;
  };

  var triggerClick = function(marker) {
    google.maps.event.trigger(marker, 'click', 'click');
  };

  var removeFromMap = function(marker) {
    marker.setMap(null);
  };

  return {
    addUserMarker: addUserMarker,
    addEventMarker: addEventMarker,
    triggerClick: triggerClick,
    removeFromMap: removeFromMap
  };
})
.controller('HomeController', function($scope, Map, Directions, Markers, HTTP) {
  $scope.map; // google map object

  $scope.initMap = function(callback) {
    $scope.loading = true; // boolean to determine whether to display loading gif
    
    // Render a possibly-reasonable guess for the location
    //$scope.position = Map.getLocalPosition();
    //$scope.map = Map.render();

    // Render the actual location, once it is found
    Map.getRealLocation(function(position) {
      Map.setLocalPosition(position);
      $scope.position = position;
      $scope.$apply(function() {
        // $apply notifies angular to watch changes and re-evaluate ng-if/show expressions
        $scope.loading = false;
      });
      $scope.map = Map.render(position);
      callback();
    });
  };

  $scope.initRoutes = function() {
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

  $scope.initMarkers = function() {
    $scope.allEvents = []; // not being utilized yet
    $scope.markers = [];

    // Add marker for user
    Markers.addUserMarker($scope.map, Map.getLocalPosition());
    
    // ---- seed ---- (for testing purposes)
    // This entire section should be deleted for production
    $scope.allEvents = [
    {
      id: 1,
      user: "Greg Domorski",
      description: "I'm at Starbucks Bros!",
      endedAt: "8 p.m.",
      location: { coordinates: [ -122.401268, 37.793686 ] }
    },
    {
      id: 2,
      user: "Max O'Connell",
      description: "I'm at SF GreenSpace HACKING! YEAH HACK REACTOR",
      endedAt: "10 p.m.",
      location: { coordinates: [ -122.400831, 37.786710 ] }
    },
    {
      id: 3,
      user: "Gloria Ma",
      description: "I'm  hanging out at the Hyatt!! Come join me",
      endedAt: "8 p.m.",
      location: { coordinates: [ -122.39573, 37.794301 ] }
    },
    {
      id: 4,
      user: "Rachel RoseFigura",
      description: "I'm at Starbucks Bros!",
      endedAt: "8 p.m.",
      location: { coordinates: [ -122.406435, 37.784118 ] }
    },    
    ];

    // Add event marker for each location
    _.forEach($scope.allEvents, function(event) {
      var marker = Markers.addEventMarker($scope.map, event);
      $scope.markers.push(marker);
    });

    // ---- end seed ----
  };

  // Triggers click on marker from click on event in feed
  $scope.callMarker = function($index){
    var marker = $scope.markers[$index];
    Markers.triggerClick(marker);
  };

  // Clears all markers from map - only used for testing purposes now
  // Eventually may be utilized for removing expired events
  $scope.clearMarkers = function() {
    _.forEach($scope.markers, function(marker) {
      Markers.removeFromMap(marker);
    });
  };

  $scope.getEvents = function(callback){
    HTTP.sendRequest('GET', '/events')
    .then(function(response) {
      var events = response.data;
      callback(events);
    });
  };

  // Updates $scope.allEvents with new events and adds markers accordingly
  // Currently never removes events, even if inactive
  $scope.updateEvents = function(events) {
    _.forEach(events, function(event) {
      if (_.pluck($scope.allEvents, '_id').indexOf(event._id) === -1) {
        console.log('pushing new event', event);
        $scope.allEvents.push(event);

        //add marker for event
        var marker = Markers.addEventMarker($scope.map, event);
        $scope.markers.push(marker);
      }
    });
  }

  $scope.initMap(function() { //finishes asynchronously
    $scope.initRoutes();
    $scope.initMarkers();
    setInterval(function(){
      $scope.getEvents(function(events) {
        $scope.updateEvents(events);
      });
    }, 1000);
  });
});

