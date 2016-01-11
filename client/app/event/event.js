// MARKED FOR DELETION

angular.module('greenfield.event', ['greenfield.services'])
.controller('EventController', function($scope, $http, User) {
  $scope.title;
  $scope.description;
  $scope.user;
  $scope.endedAt;     
  $scope.locations;
  
  $scope.sendForm = function(){
    var inputs = $scope.locations;
    //console.log($scope.title, $scope.endedAt, $scope.address, $scope.description);

    var data = {
      userId: User.getId(),
      userName: User.getName(),
      title: $scope.title,
      description: $scope.description,
      active: true,
      location:{ type: "Point", coordinates: [ $scope.locations[1], $scope.locations[0] ] },
      isPublic: !!$scope.isPublic
    };

    console.log(data);

    $http.post('/events', data).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      console.log(response);
    });
  };

  $scope.getAllPlaces = function(){
  // Initialize location autocomplete
    var places = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
    google.maps.event.addListener(places, 'place_changed', function () {
      var array = [];
      var place = places.getPlace();
      var address = place.formatted_address;
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var mesg = "Address: " + address;
      array.push(latitude);
      array.push(longitude);
      $scope.locations = array;
      console.log(array);
      });
  }();

})
.directive('formInput', function (){
  return {
    template: '<form action="/new" method="POST">' +
    '<p><label for="name"> Title </label> <input name="title" required/>' + 
    '</p><p><label for="description"> Description </label> '+
    '<textarea style="vertical-align: top" name="description">'+
    '</textarea></textarea> </p><p><label for="datetime1"> Starting Time: </label>'+
    ' <input type="text" id="time" data-format="h:mm a" data-template="hh : mm a" name="datetime1" value="8:30 pm" required></p>'+
    '<p><label for="datetime2"> Ending Time: </label>'+
    '<input type="text" id="time2" data-format="h:mm a" data-template="hh : mm a" name="datetime2" value="8:30 pm" required></p>'+
    '<p><label for="location">Location:</label>' + '<input type="text" id="txtPlaces" style="width: 250px" name="location" placeholder="Enter a location" required/></p> <input type="hidden" id="latitude"/> <input type="hidden" id="longitude"/><button type="submit"> Submit </button></form>'
  };

});