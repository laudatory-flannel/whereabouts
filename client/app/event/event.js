angular.module('greenfield.event', [])
.controller('EventController', function($scope) {
  // Initialize combodate drop-down menus in view
  $(function(){
    $('#time').combodate({
      firstItem: 'name',
      minuteStep: 1
    }); 
    $('#time2').combodate({
      firstItem: 'name', 
      minuteStep: 1
    }); 


  $("#contactLink").click(function(){
      if ($("#contactForm").is(":hidden")){
          $("#contactForm").slideDown("slow");
      } else {
          $("#contactForm").slideUp("slow");
      }
      
  });
  
  function closeForm(){
      $("#messageSent").show("slow");
      setTimeout('$("#messageSent").hide();$("#contactForm").slideUp("slow")', 2000);
 }


  });






  // Initialize location autocomplete
  var places = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
  google.maps.event.addListener(places, 'place_changed', function () {
    var place = places.getPlace();
    var address = place.formatted_address;
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();
    var mesg = "Address: " + address;
    $('#latitude').text(latitude);
    $('#latitude').text(longitude);
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