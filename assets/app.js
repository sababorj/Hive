// variables to store google places search parameters (hard-coded now for testing but will get from user input when page is ready)
var userLocation = "92101";
var userInterest = "restaurant";
var userInterestParam = "italian";
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
        console.log(geoResult);
        console.log("Lattitude: " +geoResult[0].geometry.location.lat);
        // storing the lattitude value for zipcode in a variable
        var userLat = geoResult[0].geometry.location.lat;
        console.log("Longitude: " +geoResult[0].geometry.location.lng);
        // storing the longitude value for zipcode in a variable
        var userLng = geoResult[0].geometry.location.lng;
        // creating and storing the query url with user location(formatted: lat.,long) and interest parameters for use in google places api nearby search
        var queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=1500&type=${userInterest}&keyword=${userInterestParam}&opennow&key=${apiKey}`;
        console.log("QueryUrl: " + queryUrl);
    });