homeModule.factory('Markers', function() {
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


  //adds marker to page
  var addUserMarker = function(map, position) {
    return addMarker(map, position, USER_ICON_URL);
  };


  //adds event marker to page
  var addEventMarker = function(map, event) {
    var latitude = event.location.coordinates[1];
    var longitude = event.location.coordinates[0];
    var marker = addMarker(map, [latitude, longitude], EVENT_ICON_URL);
    var clickHandler = function() {
      infoWindow.setContent(
        "<h4>" + event.userName +
        "</h4>" + '<p style="color: green">' + event.title + '</p>' + event.description + 
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
});