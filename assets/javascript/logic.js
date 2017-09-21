

  /* Initialize Firebase
  var config = {
   apiKey: "AIzaSyAJt3fgxtDdHMSi3D_UVm-AGh7--BUX-lU",
   authDomain: "tripstar-1505508268662.firebaseapp.com",
   databaseURL: "https://tripstar-1505508268662.firebaseio.com",
   projectId: "tripstar-1505508268662",
   storageBucket: "tripstar-1505508268662.appspot.com",
   messagingSenderId: "831676656189"
  };
  
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
  // ...
  }).catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
  // ...
  });
 */

  function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
  }

  $("#searchBtn").click(function(event){
    event.preventDefault();
    var city = $("#city").val();
    var state = $("#state").val();
    $("#pac-input").val(city + " " + state);

    // var e = jQuery.Event("keypress", 13);
    // $("#pac-input").trigger(e);
    var input = document.getElementById('pac-input');
    google.maps.event.trigger(input, 'focus')
    google.maps.event.trigger(input, 'keydown', {
        keyCode: 13
    });
    // var searchBox = new google.maps.places.SearchBox(input);
    window.scroll(0,findPos(document.getElementById("map")));
    // google.maps.event.trigger(searchBox, 'place_changed');

    //calling the Event Brite function
    populateEventbrite();
  })

  // GoogleMaps apiKey
  // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyB9Nvofo-afipjBXoaO4g_hoyDMsIZqUiE
  function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.9642529, lng: -91.8318334},
          zoom: 4,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          console.log(places);
          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          console.log(bounds);
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      } // initAutocomplete Function Closure


      // This is where the #eventbriteDiv space is reserved for Event Brite to populate its material per inputs transferred to the API query.

      function populateEventbrite() {
        var location = document.getElementById("city").value +"%2c"+ document.getElementById("state").value;
       // var location = spot.replace(/\s+/g, "");
        console.log(location);
        var arrival = document.getElementById("arrival").value;
        console.log(arrival);


        //var arrival = (moment(document.getElementById("arrival")).format("YYYY-MM-DD")) + "T07:00:00";

        var queryUrl = "https://www.eventbriteapi.com/v3/events/search/?token=ZA2MIRZYEOEAA2YQBJNE&location.address="
                        + location + "&start_date.range_start=" + arrival + "T07%3A00%3A00" 
        console.log(queryUrl);
        //music,fitness,food,bars,art,museums&" + 
        // + location + arrival + "&page=1"
        //"&q=" + arrival + 
        

        var events = $("#eventbriteDiv");
        //events.html("<i>Loading events, please stand by...</i>");

          $.ajax({
          url: queryUrl,
          method: "GET"
        })
          
         .done(function(response) {
          console.log(queryUrl);
          console.log("response")
          console.log(response);

            if(response.events.length) {
                var detail = "";
                for (var i=0; i<response.events.length; i++) {
                     var event = response.events[i];
                     var eventTime = moment(event.start.local).format('MM/DD/YYYY hh:mm A');
                   
                    detail += "<div class='container'>";
                    detail += "<h2><a href='" + event.url + "'>" + event.name.text + "</a></h2>";
                //  detail += "<p><b>Location: " + event.venue.address.address_1 + "</b><br/>";
                    detail += "<b>Date/Time: " + eventTime + "</b></p>";
                    detail += "<div class='panel panel-default'>";
                    detail += "<div class= 'panel-body'>";
                    detail += "<p>" + event.description.text + "</p>";
                    detail += "</div>";
                    detail += "</div>";
                    detail += "</div>";
                }
                events.html(detail);

            } else {
                events.html("<p>Sorry, there are no upcoming events.</p>");
              };
          });
        };
        

        
          
    
  