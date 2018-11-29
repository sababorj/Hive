// variables to store google places search parameters (hard-coded now for testing but will get from user input when page is ready)
var userLocation = "92101";
var userInterest = "restaurant";
var userInterestParam = "italian";
var professionalInterest = "startup";
//url for proxy server which we need to make requests from the google places api
var corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
var apiKey = "AIzaSyD5YTMyDlZYKKMMrlYIguDdqT68DxBrLx4"
//url for geocode api that will convert our zipcode to lattitude and longitude
var geocodeAPIUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${userLocation}&key=${apiKey}`;
//calling the geocode api via proxy server
$.ajax({
    url: corsAnywhereUrl + geocodeAPIUrl,
    method: "GET"
})
    .then(function (response) {
        var geoResult = response.results;
        // storing the lattitude value for zipcode in a variable
        var userLat = geoResult[0].geometry.location.lat;
        // storing the longitude value for zipcode in a variable
        var userLng = geoResult[0].geometry.location.lng;
        // creating and storing the query url with user location(formatted: lat.,long) and interest parameters for use in google places api nearby search
        var queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=1500&type=${userInterest}&keyword=${userInterestParam}&key=${apiKey}`;

        // second api call. using the location variables we retrieved from the call above, we call a nearby search from google places api
        $.ajax({
            url: corsAnywhereUrl + queryUrl,
            method: "GET"
        })
            .then(function (response) {
                var nearbyResult = response.results;
                // for loop to go through the JSON response and retrieve name, customer rating and address for each object in the results
                for (i = 0; i < nearbyResult.length; i++) {
                    var placeName = nearbyResult[i].name;
                    var placeRating = nearbyResult[i].rating
                    var placeAddress = nearbyResult[i].vicinity
                    // storing each place object's photo reference in a variable
                    var photoRef = nearbyResult[i].photos[0].photo_reference;
                    // creating the url we will use to retrieve images from google's place photo service
                    var photoQueryUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${photoRef}&key=${apiKey}`;
                    var image = $("<img>");
                    image.attr("src", photoQueryUrl);
                    // the next line will append images to the html when we have the target id
                    // $("#").append(image);
                };

            });
    });

    // starting with the meeetup api
    // variable for meetup api key
    var meetupKey = "371c3079557627617125571f7e6960";
    // variable for the meetup query url. Note: &page=[number] is the number of results we are limiting our response to. &radius is in miles
    var meetupUrl = `https://api.meetup.com/find/upcoming_events?photo-host=public&page=7&text=${professionalInterest}&zip=${userLocation}&radius=20&fields=events&key=${meetupKey}&sign=true`;
    console.log("Meetup Url: " + meetupUrl)
    $.ajax({
        url: corsAnywhereUrl + meetupUrl,
        method: "GET"
    }).then(function(response){
        for (j = 0; j < response.events.length; j++) {
        // console.log(response.events[j].id); 
        //Sheetal -> this is the path to the event id that we need for your rsvp code :)
        }
    });