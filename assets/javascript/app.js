auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        console.log("user is logged in");

        database.ref("/userinfo")
            .orderByChild("userId")
            .equalTo(firebaseUser.uid)
            .once("child_added", function (snapshot) {
                console.log(snapshot.val());
                userInfo = snapshot.val();

                // Change the HTML to reflect
                $("#name-tag").text(snapshot.val().firstName);
                $("#birthday-slot").text(snapshot.val().birthday);
                $("#zipcode-slot").text(snapshot.val().zipcode);


                var userPet = snapshot.val().pet;
                var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + userPet + "&api_key=yFAPwe4TWmpuqbYlD7mElRe2RO3abedf&g&limit=1";
                console.log(userPet);

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    // Creating and storing an image tag
                    console.log(response);
                    var userGif = $("<img>");
                    var imageUrl = response.data[0].images.original.url;
                    console.log(imageUrl);
                    console.log(userGif);
                    userGif.attr("src", imageUrl);
                    userGif.attr("alt", "User Avatar");

                    // Prepending the catImage to the images div
                    $("#profile-userpic").append(userGif);
                });




                // variables to store google places search parameters (hard-coded now for testing but will get from user input when page is ready)
                var userLocation = snapshot.val().zipcode;
                var socialInterestOne = snapshot.val().interest1.type;
                $("#places-one").text(socialInterestOne);
                var socialInterestTwo = snapshot.val().interest2.type;
                $("#places-two").text(socialInterestTwo);
                var professionalInterest = snapshot.val().interest3.type;
                $("#meetup-one").text(professionalInterest);
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
                        var queryUrlOne = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=1500&type=${socialInterestOne}&key=${apiKey}`;
                        console.log(queryUrlOne);
                        var queryUrlTwo = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=1500&type=${socialInterestTwo}&key=${apiKey}`;
                        console.log(queryUrlTwo);
                        // second api call. using the location variables we retrieved from the call above, we call a nearby search from google places api
                        gettingGooglePlacesInfo(corsAnywhereUrl, queryUrlOne, apiKey, "interest-one-div");
                        gettingGooglePlacesInfo(corsAnywhereUrl, queryUrlTwo, apiKey, "interest-two-div");
                        // starting with the meeetup api
                        // variable for meetup api key
                        var meetupKey = "371c3079557627617125571f7e6960";
                        // variable for the meetup query url. Note: &page=[number] is the number of results we are limiting our response to. &radius is in miles
                        var meetupUrl = `https://api.meetup.com/find/upcoming_events?photo-host=public&page=7&text=${professionalInterest}&lat=${userLat}&lon=${userLng}&radius=20&fields=events&key=${meetupKey}&sign=true`;
                        console.log("Meetup Url: " + meetupUrl)
                        $.ajax({
                            url: corsAnywhereUrl + meetupUrl,
                            method: "GET"
                        }).then(function (response) {
                            for (j = 0; j < 3; j++) {
                                var eventName = $("<p>").html(`<b>${response.events[j].name}</b>`);
                                var eventGroup = $("<p>").text(response.events[j].group.name);
                                var eventDate = response.events[j].local_date;
                                var eventTime = response.events[j].local_time;
                                var eventDateTime = $("<p>").html(`<b>Event Date:</b> ${eventDate}, ${eventTime}`)
                                var eventUrl = response.events[j].link;
                                console.log(eventUrl);
                                var meetupDiv = $("<div>").attr("class", "row");
                                var meetupDetailsDiv = $("<div>").attr("class", "col-md-12");
                                meetupDetailsDiv.append(eventName, eventGroup, eventDateTime);
                                meetupDiv.append(meetupDetailsDiv);
                                $("#interest-three-div").append(meetupDiv);
                            }
                        });
                    });
            }
            );
    } else {
        console.log("user id loged off")
        window.location.href = "logout.html"
    }
})
// function for call the google places api 
function gettingGooglePlacesInfo(corsAnywhereUrl, url, apiKey, divName) {
    $.ajax({
        url: corsAnywhereUrl + url,
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
                $("#"+divName).append(newDiv);
            };
        });
}
