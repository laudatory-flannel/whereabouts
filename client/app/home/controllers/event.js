homeModule.controller('EventController', function($scope, HTTP, User) {
  $scope.title;
  $scope.description;
  $scope.endedAt;     
  $scope.position; // 2-tuple of [ latitude, longitude ]
  $scope.isPublic;
  
  // Returns specific formatting of location to conform to Mongoose
  var mongoosifyLocation = function(position) {
    return { type: "Point", coordinates: [ $scope.position[1], $scope.position[0] ] };
  };

  // POSTs new event to server
  $scope.sendForm = function(){
    var data = {
      userId: User.getId(),
      userName: User.getName(),
      title: $scope.title,
      description: $scope.description,
      endedAt: $scope.endedAt,
      location: mongoosifyLocation($scope.position),
      isPublic: !!$scope.isPublic,
      active: true
    };

    HTTP.sendRequest('POST', '/events', data)
    .then(function(response) {
      console.log('posted event to server:', response.data);
    });
  };

  // Initializes location autocomplete
  var autocompleter = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
  google.maps.event.addListener(autocompleter, 'place_changed', function () {
    var place = autocompleter.getPlace();
    // var address = place.formatted_address;
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();
    $scope.position = [ latitude, longitude ];
    console.log($scope.position);
  });
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