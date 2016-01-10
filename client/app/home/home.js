// .controller('HomeController', function ($scope, $window, $location, Services) {
   
// });

// random default location in Berkeley, CA
var DEFAULT_POSITION = [ 30, -120 ];

var app = angular.module('greenfield.home', ['greenfield.services']);
app.controller('HomeController', function($scope, localStorage, $http) {
  $scope.map; // google map object
  $scope.loading; // boolean for whether map is loading
  $scope.position = [ null, null ]; // 2-tuple of [ latitude, longitude ]
  $scope.allEvents;
  $scope.allLocations;
  $scope.postMarker = [];

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


  $scope.callMarker = function(num){
    console.log($scope.postMarker);
      google.maps.event.trigger($scope.postMarker[num], 'click', 'click');

  },

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

    var allLocations = [
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
    }  
    ];

    var myLocations = [
      ['<h4> My People</h4>', 37.793686, -122.401268],
      ['<h4>My People</h4>', 37.789911, -122.402327],
    ];


    $scope.allLocations = allLocations;

    var infowindow = new google.maps.InfoWindow({maxWidth: 160});
    var postMarker;

    for (var i = 0; i < allLocations.length; i++) {  
      $scope.postMarker.push(new google.maps.Marker({
        position: new google.maps.LatLng(allLocations[i].latitude, allLocations[i].longitude), 
        animation: google.maps.Animation.DROP,
        map: $scope.map
      }));
      

      google.maps.event.addListener($scope.postMarker[i], 'click', (function(postMarker, i) {
        return function() {
          infowindow.setContent(allLocations[i].personname);
          infowindow.open($scope.map, postMarker);
        };
      })($scope.postMarker[i], i));
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



//   $scope.compile = function(element) {
//     var el = angular.element(element);    
//     $scope = el.scope();
//     $injector = el.injector();
//     $injector.invoke(function($compile){
//        $compile(el)($scope);
//     });  
//   };

//   $scope.open_panel = function(){
//     $scope.slideIt();
//     var el = document.getElementById("sidebar");
//     el.setAttribute("id", "sidebar1");
//     el.setAttribute("ng-click", "close_panel()");
//     $scope.compile(el);
//   };

//   $scope.slideIt = function(){
//     var slidingDiv = document.getElementById("slider");
//     var stopPosition = 0;
//     if (parseInt(slidingDiv.style.right) < stopPosition) {
//     slidingDiv.style.right = parseInt(slidingDiv.style.right) + 2 + "px";
//     setTimeout($scope.slideIt, 1);
//     }
//   };

//   $scope.slideIn = function(){
//     var slidingDiv = document.getElementById("slider");
//     var stopPosition = -342;
//     if (parseInt(slidingDiv.style.right) > stopPosition) {
//       slidingDiv.style.right = parseInt(slidingDiv.style.right) - 2 + "px";
//       setTimeout($scope.slideIn, 1);
//     }
//   };

//   $scope.close_panel = function(){
//     $scope.slideIn();
//     el = document.getElementById("sidebar1");
//     el.setAttribute("id", "sidebar");
//     el.setAttribute("ng-click", "open_panel()");
//     $scope.compile(el);
//   };

});

app.controller('MainCtrl', function ($scope) {
    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };
  });

app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });