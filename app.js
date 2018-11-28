
var userLocation = "92101";
var userInterest = "restaurant";
var userInterestParam = "italian";
var corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
var apiKey = "AIzaSyD5YTMyDlZYKKMMrlYIguDdqT68DxBrLx4"

var geocodeAPIUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${userLocation}&key=${apiKey}`;

$.ajax({
    url: corsAnywhereUrl + geocodeAPIUrl,
    method: "GET"
})
    .then(function (response) {
        var geoResult = response.results;
        console.log(geoResult);
        console.log("Lattitude: " +geoResult[0].geometry.location.lat);
        var userLat = geoResult[0].geometry.location.lat;
        console.log("Longitude: " +geoResult[0].geometry.location.lng);
        var userLng = geoResult[0].geometry.location.lng;
        var queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=1500&type=${userInterest}&keyword=${userInterestParam}&opennow&key=${apiKey}`;
        console.log("QueryUrl: " + queryUrl);
        $.ajax({
            url: corsAnywhereUrl + queryUrl,
            method: "GET"
        })
            .then(function (response) {
                var nearbyResult = response.results;
                console.log(nearbyResult);
                console.log("Length: " + nearbyResult.length);
                for (i=0; i < nearbyResult.length; i++) {
                    var placeName = nearbyResult[i].name;
                    console.log("Name: " + placeName);
                    var placeRating = nearbyResult[i].rating
                    console.log("Rating: " + placeRating);
                    var placeAddress = nearbyResult[i].vicinity
                    console.log("Address: " + placeAddress);
                    var photoRef = nearbyResult[i].photos[0].photo_reference;
                    console.log(photoRef);
                    // var placePhoto = get from place photo service - documentation open in browser
                    var photoQueryUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${photoRef}&key=${apiKey}`;
                    console.log("photo query url: " + photoQueryUrl);
                    // $.ajax({
                    //     url: corsAnywhereUrl + photoQueryUrl,
                    //     method: "GET"
                    // })
                    // .then(function(response) {
                    //     document.write(response);
                    // });
                };

            });
    });