var map;
function initMap() {
  
};

var success = function(position) {
  console.log(position);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 8
  });
}
var error = function(error) {
  console.log("error arguments:", arguments);
  console.log("error getting position:", error.code);
}

navigator.geolocation.getCurrentPosition(success, error);