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

$(document).on("submit", "form", function (event) {
    event.preventDefault();
    $("#Pmsg").remove();
    $("#Zmsg").remove();
    $("#Emsg").remove();
    
    var favAnnimal;
    $("#annimal").val() == "Select your faveriot animal!" ? favAnnimal = "pet" : favAnnimal = $("#annimal").val();

    var username = $("#username-input").val().trim()

    if ($("#password-input").val().trim().length > 5) {
        password = $("#password-input").val().trim()
    } else {
        password = false;
        Pmsg = $('<p>').attr("id","Pmsg").text("Please provide at least 6 charecter")
        $("#password-input").empty()
        $("#password-input").after(Pmsg)
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
        Zmsg = $('<p>').attr("id","Zmsg").text("Please provide valid zipcode")
        $("#zip-input").empty()
        $("#zip-input").after(Zmsg)
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
            "zipcode": zipcode,
            "pet" : favAnnimal
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
                    pet: userInfoObj.pet,
                    userId: loggedInUser.uid,
                });
                // move to the interest page
                window.location.href = "interests.html";
            }
        }).catch(function (error) {
            console.log(`Error code: ${error.code}, Error msg: ${error.message}`)
            if(error.code = "auth/email-already-in-use"){
                username = false;
                var Emsg = $("<p>").attr("id","Emsg").text("please provide a valid email address. This username maybe already taken");
                $("#username-input").after(Emsg)
            }
        })
    }
})

$(document).on("click", "#logout-btn", function (event) {
    event.preventDefault();
    auth.signOut();
    window.location.href = "logout.html";
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