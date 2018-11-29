// Initialize Firebase
var config = {
    apiKey: "AIzaSyAchBPc26tTCgCKlzrk-xY4kAdMTS3ot5w",
    authDomain: "cbc-first.firebaseapp.com",
    databaseURL: "https://cbc-first.firebaseio.com",
    projectId: "cbc-first",
    storageBucket: "cbc-first.appspot.com",
    messagingSenderId: "462974477285"
};
firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();

// initial values globally
var username;
var password;
var firstName;
var lastName = "";
var email;
var birthDate = "";
var zipcode;
var userInfoObj = [];
var move = true;


// this function will gather valid user input
function gatherBasicInfo() {
    $(".alert").empty();
    move = true
    if ($("#username-input").val().trim().length > 0) {
        var username = $("#username-input").val().trim()
    } else {
        var username = false;
        var Umsg = $("<p>").text("Please provide a username")
        $("#userAlert").append(Umsg)
    }

    if ($("#password-input").val().trim().length > 5) {
        password = $("#password-input").val().trim()
    } else {
        password = false;
        var Pmsg = $("<p>").text("Please provide 6 digit")
        $("#passAlert").append(Pmsg)
    }

    if ($("#first-input").val().trim().length > 0) {
        firstName = $("#first-input").val().trim()
    } else {
        firstName = false;
        var Fmsg = $("<p>").text("Please provide a name")
        $("#firstnameAlert").append(Fmsg)
    }

    $("#last-input").val().trim().length > 0 ? lastName = $("#last-input").val().trim() : false;

    if ($("#email-input").val().trim().length > 0) {
        email = $("#email-input").val().trim()
      //  TODO: for future implementation: a check on the email to not be in our system (in our system should be a function to check if email is already in our system)
        // use the error code that fire base returns
        // if ("in our system") {
        //     email = false;
        //     var Emsg = $("<p>").text("an account is already associated with this email!")
        //     $("#emailAlert").append(Emsg)
        // }
    } else {
        email = false;
        var Emsg = $("<p>").text("Please provide an Email")
        $("#emailAlert").append(Emsg)
    }

    $("#birth-input").val().trim().length > 0 ? birthDate = $("#birth-input").val().trim() : false;

    if ($("#zip-input").val().trim().length == 5) {
        zipcode = parseInt($("#zip-input").val().trim())
    } else {
        zipcode = false;
        var Zmsg = $("<p>").text("Please provide a valid zipcode")
        $("#zipcodeAlert").append(Zmsg)
    }
    // if all the fields are filed correctly push the information to the info object
    if (username && password && firstName && zipcode) {
        userInfoObj.push({ "username": username });
        userInfoObj.push({ "password": password });
        userInfoObj.push({ "firstName": firstName });
        userInfoObj.push({ "lastName": lastName });
        userInfoObj.push({ "birthday": birthDate });
        userInfoObj.push({ "zipcode": zipcode });
        return userInfoObj
    } else {
        move = false;
        return move
    }
}
$(document).on("click", "#register-user", function (event) {
    event.preventDefault();
    gatherBasicInfo();
    console.log(move)
    if (move) {
        //create the user account in database
        console.log(userInfoObj[0].username)
        auth.createUserWithEmailAndPassword(userInfoObj[0].username, userInfoObj[1].password).then( (user) => {
            if(user){
                user.updateProfile({
                    firstName : userInfoObj[2].firstName,
                    lastName : userInfoObj[3].lastName,
                    birthday : userInfoObj[4].birthday,
                    zipcode : userInfoObj[5].zipcode
                }).then((s) => {
                    console.log("successfully added user information to their account")
                })
            }
        }).catch(function(error){
            console.log(`Error code: ${error.code}, Error msg: ${error.message}`)
        })

        // gather information for ourself about the state of user
       
        
        console.log(userInfoObj)
        // move to the interest page
        // window.location.href = "interests.html"

    }
})
$(document).on("click", "#create-account", function () {
    window.location.href = "profile.html"
})

$(document).on("click", "#logout-btn", function (event) {
    event.preventDefault();
    auth.signOut();
})


$(document).on("click", "#login", function (event) {
    event.preventDefault();
    var userEmail = $("#username").val().trim();
    var userPass = $("#Password").val().trim();
    auth.signInWithEmailAndPassword(userEmail,userPass).then((user) => {
        if(user){
            console.log("user is login")
        }
    }).catch((error) => {
        console.log(`Error code: ${error.code}, Error msg: ${error.message}`)
    })
})