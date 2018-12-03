// when user is logged in identify them by uid and retrieve their info
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {

        database.ref("/userinfo")
            .orderByChild("userId")
            .equalTo(firebaseUser.uid)
            .once("child_added", function (snapshot) {
                userInfo = snapshot.val();

                // change the HTML to reflect
                $("#name-tag").text(snapshot.val().firstName);
                $("#birthday-slot").text(snapshot.val().birthday);
                $("#zipcode-slot").text(snapshot.val().zipcode);
                var userPet = snapshot.val().pet;
                var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + userPet + "&api_key=yFAPwe4TWmpuqbYlD7mElRe2RO3abedf&g&limit=1";
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    // creating an image tag and storing the gif
                    var userGif = $("<img>");
                    var imageUrl = response.data[0].images.original.url;
                    userGif.attr("src", imageUrl);
                    userGif.attr("alt", "User Avatar");

                    // prepending the gif to the profile div
                    $("#profile-userpic").append(userGif);
                });
                // storing user location and interests from database
                var userLocation = snapshot.val().zipcode;
                var socialInterestOne = snapshot.val().interest1.type;
                $("#places-one").text(socialInterestOne);
                var socialInterestTwo = snapshot.val().interest2.type;
                $("#places-two").text(socialInterestTwo);
                var professionalInterest = snapshot.val().interest3.type;
                $("#meetup-one").text(professionalInterest);
                //url for proxy server to make requests from apis
                var corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
                // google places api key
                var apiKey = "AIzaSyD5YTMyDlZYKKMMrlYIguDdqT68DxBrLx4"
                //url for geocode api which converts zipcode to lattitude, longitude
                var geocodeAPIUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${userLocation}&key=${apiKey}`;
                //ajax call to geocode api
                $.ajax({
                    url: corsAnywhereUrl + geocodeAPIUrl,
                    method: "GET"
                })
                    .then(function (response) {
                        var geoResult = response.results;
                        //storing the lat, long values from response
                        var userLat = geoResult[0].geometry.location.lat;
                        var userLng = geoResult[0].geometry.location.lng;
                        //query urls with user parameters for google places api nearby search
                        var queryUrlOne = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=15000&type=${socialInterestOne}&key=${apiKey}`;
                        var queryUrlTwo = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=15000&type=${socialInterestTwo}&key=${apiKey}`;
                        // calling the gettingGooglePlacesInfo functions for each interest
                        gettingGooglePlacesInfo(corsAnywhereUrl, queryUrlOne, apiKey, "interest-one-div");
                        gettingGooglePlacesInfo(corsAnywhereUrl, queryUrlTwo, apiKey, "interest-two-div");
                        // storing meetup api key
                        var meetupKey = "371c3079557627617125571f7e6960";
                        // variable for the meetup query url
                        var meetupUrl = `https://api.meetup.com/find/upcoming_events?photo-host=public&page=7&text=${professionalInterest}&lat=${userLat}&lon=${userLng}&radius=20&fields=events&key=${meetupKey}&sign=true`;
                        //ajax call to meetup api
                        $.ajax({
                            url: corsAnywhereUrl + meetupUrl,
                            method: "GET"
                        }).then(function (response) {
                            if (response) {
                                for (j = 0; j < 3; j++) {
                                    // creating html elements and display results
                                    var eventName = $("<p>").html(`<b>${response.events[j].name}</b>`);
                                    var eventGroup = $("<p>").text(response.events[j].group.name);
                                    var eventDate = response.events[j].local_date;
                                    var eventTime = response.events[j].local_time;
                                    var eventDateTime = $("<p>").html(`<b>Event Date:</b> ${eventDate}, ${eventTime}`)
                                    var eventLink = response.events[j].link;
                                    var a = $("<a>")
                                    a.attr("href", eventLink);
                                    a.attr("target", "blank");
                                    a.append(eventName);
                                    var meetupDiv = $("<div>").attr("class", "row");
                                    var meetupDetailsDiv = $("<div>").attr("class", "col-md-12");
                                    meetupDetailsDiv.append(a, eventGroup, eventDateTime);
                                    meetupDiv.append(meetupDetailsDiv);
                                    $("#interest-three-div").append(meetupDiv);
                                }
                            } else {
                                // if no response displaying error message on page
                                var errorDiv = $("<div>");
                                errorDiv.html(`<p>There are no upcoming ${professionalInterest} meetups in your area`);
                                $("#interest-three-div").append(errorDiv);
                            }
                        });
                    });
            }
            );
    } else {
        // if user is logged out send them to logout page
        window.location.href = "logout.html"
    }
})
// function passing user specific parameters for calling the google places api 
function gettingGooglePlacesInfo(corsAnywhereUrl, url, apiKey, divName) {
    $.ajax({
        url: corsAnywhereUrl + url,
        method: "GET"
    })
        .then(function (response) {
            var nearbyResult = response.results;
            // for loop through JSON response retrieve place info
            for (var i = 0; i < 3; i++) {
                var placeName = $("<p>").html(`<b> ${nearbyResult[i].name}</b>`);
                var placeRating = $("<p>").html(`<b>Rating</b> ${nearbyResult[i].rating} stars`);
                var placeAddress = $("<p>").html(`<b>Address: </b>${nearbyResult[i].vicinity}`);
                // storing each place object's photo reference
                var photoRef = nearbyResult[i].photos[0].photo_reference;
                // creating the url to retrieve images and display in html
                var photoQueryUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${photoRef}&key=${apiKey}`;
                var image = $("<img>").attr("id", `place-image${[i]}`);
                image.attr("src", photoQueryUrl);
                // creating the url to retrieve recommended venue's google maps url
                var placeId = nearbyResult[i].place_id;
                var placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=url&key=${apiKey}`;
                var newDiv = $("<div>").attr("class", "row");
                        var imageDiv = $("<div>").attr("class", "col-md-4");
                        imageDiv.append(image);
                        var textDiv = $("<div>").attr("class", "col-md-8")
                        textDiv.append(a, placeRating, placeAddress);
                        newDiv.append(imageDiv, textDiv);
                        $("#" + divName).append(newDiv);
                $.ajax({
                    url: corsAnywhereUrl + placeDetailsUrl,
                    method: "GET"
                })
                    .then(function (response) {
                        var venueLink = response.result.url;
                        console.log(venueLink);
                        // creating html elements to display results
                        var a = $("<a>")
                        a.attr("href", venueLink);
                        a.attr("target", "blank");
                        a.append(placeName); 
                    });
            };
        });
};
