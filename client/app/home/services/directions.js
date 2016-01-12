homeModule.factory('Directions', function() {
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
});