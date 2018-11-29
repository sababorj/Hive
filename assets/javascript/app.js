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
                for (i = 0; i < 3; i++) {
                    var placeName = $("<p>").html(`<b> ${nearbyResult[i].name}</b>`);
                    var placeRating = $("<p>").html(`<b>Rating</b> ${nearbyResult[i].rating} stars`);
                    var placeAddress = $("<p>").html(`<b>Address: </b>${nearbyResult[i].vicinity}`);
                    // storing each place object's photo reference in a variable
                    var photoRef = nearbyResult[i].photos[0].photo_reference;
                    // creating the url we will use to retrieve images from google's place photo service
                    var photoQueryUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${photoRef}&key=${apiKey}`;
                    var image = $("<img>").attr("id", `place-image${[i]}`);
                    image.attr("src", photoQueryUrl);
                    // creating a new div that has the class of row
                    var newDiv = $("<div>").attr("class", "row");
                    // creating a new div with class of col-md-4 and appending our place image
                    var imageDiv = $("<div>").attr("class", "col-md-4");
                    imageDiv.append(image);
                    // creating a text div with class of col-md-8 and appending all of our place text
                    var textDiv = $("<div>").attr("class", "col-md-8")
                    textDiv.append(placeName, placeRating, placeAddress);
                    // appending the image and text divs to the newDiv
                    newDiv.append(imageDiv, textDiv);
                    // appending the newDiv to the html div with id of interest-one-div
                    $("#interest-one-div").append(newDiv);
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
        for (j = 0; j < 3; j++) {
            console.log(response.events[j]);
            var eventName = $("<p>").html(`<b>${response.events[j].name}</b>`);
            console.log(eventName);
            var eventGroup = $("<p>").text(response.events[j].group.name);
            console.log(eventGroup);
            var eventDate = response.events[j].local_date;
            console.log(eventDate);
            var eventTime = response.events[j].local_time;
            console.log(eventTime);
            var eventDateTime = $("<p>").html(`<b>Event Date:</b> ${eventDate}, ${eventTime}`)
            var eventUrl = response.events[j].link;
            console.log(eventUrl);
            var meetupDiv = $("<div>").attr("class", "row");
            var meetupDetailsDiv = $("<div>").attr("class", "col-md-12");
            meetupDetailsDiv.append(eventName, eventGroup, eventDateTime);
            meetupDiv.append(meetupDetailsDiv);
            $("#interest-two-div").append(meetupDiv);

        }
    });