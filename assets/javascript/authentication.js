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


// this function will gather valid user input

$(document).on("click", "#register-user", function (event) {
    event.preventDefault();
    $(".alert").empty();
    // verify the data
    // var username = false;
    //     var Umsg = $("<p>").text("Please provide a username")
    //     $("#userAlert").append(Umsg)
    // @TODO: if user name is in use dont do it
    var username = $("#username-input").val().trim()

    if ($("#password-input").val().trim().length > 5) {
        password = $("#password-input").val().trim()
    } else {
        password = false;
        var Pmsg = $("<p>").text("Please provide 6 digit")
        $("#passAlert").append(Pmsg)
    }

    var firstName = $("#first-input").val().trim()

    var lastName = ""
    $("#last-input").val().trim().length > 0 ? lastName = $("#last-input").val().trim() : false;

    var birthDate = ""
    $("#birth-input").val().trim().length > 0 ? birthDate = $("#birth-input").val().trim() : false;

    if ($("#zip-input").val().trim().length == 5) {
        var zipcode = parseInt($("#zip-input").val().trim())
    } else {
        var zipcode = false;
        var Zmsg = $("<p>").text("Please provide a valid zipcode")
        $("#zipcodeAlert").append(Zmsg)
    }

    // if all the fields are filed correctly create the user object
    var userInfoObj = {};
    var data = false
    if (username && password && firstName && zipcode) {
        var userInfoObj = {
            "username": username,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "birthday": birthDate,
            "zipcode": zipcode
        }
        data = true;
    }

    //create the user account in database
    if(data){
        console.log(userInfoObj.username, userInfoObj.password)
        auth.createUserWithEmailAndPassword(userInfoObj.username, userInfoObj.password).then((user) => {
            if (user) {
                //    console.log(userInfoObj[0].username, userInfoObj[1].password)
                var loggedInUser = auth.currentUser;
                database.ref("/userinfo").push({
                    firstName: userInfoObj.firstName,
                    lastName: userInfoObj.lastName,
                    birthday: userInfoObj.birthday,
                    zipcode: userInfoObj.zipcode,
                    userId: loggedInUser.uid
                });
                // move to the interest page
                window.location.href = "interests.html";
            }
        }).catch(function (error) {
            console.log(`Error code: ${error.code}, Error msg: ${error.message}`)
        })
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
    console.log(userEmail, userPass)
    auth.signInWithEmailAndPassword(userEmail, userPass).then((user) => {
        if (user) {
            console.log("user is login")

            window.location.href = "profile.html";
        }
    }).catch((error) => {
        console.log(`Error code: ${error.code}, Error msg: ${error.message}`)
    })
})

// gather information for ourself about the state of user
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        console.log("user is logged in");

        database.ref("/userinfo")
            .orderByChild("userId")
            .equalTo(firebaseUser.uid)
            .once("child_added", function (snapshot) {
                console.log(snapshot.val());
            }
            );
    } else {
        console.log("user id loged off")
    }
})