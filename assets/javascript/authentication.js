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

// gathering user input starts when user click the save button
    $(document).on("click","#register-user", function(event){
        event.preventDefault();
        $(".alert").empty();
     
        // initial values 
        var username;
        var password;
        var firstName;
        var lastName = "";
        var email;
        var birthDate = "";
        var zipcode; 

        // gather information
        if($("#username-input").val().trim().length > 0) {
            username = $("#username-input").val().trim()
        } else { 
            username = false;
            var Umsg = $("<p>").text("Please provide a username")
            $("#userAlert").append(Umsg)
        } 

        if($("#password-input").val().trim().length > 6) {
            password = $("#password-input").val().trim()
        } else { 
            password = false;
            var Pmsg = $("<p>").text("Please provide 6 digit")
            $("#passAlert").append(Pmsg)
        } 

        if($("#first-input").val().trim().length > 0  ) {
            firstName = $("#first-input").val().trim()
        } else { 
            firstName = false;
            var Fmsg = $("<p>").text("Please provide a name")
            $("#firstnameAlert").append(Fmsg)
        } 

        $("#last-input").val().trim().length > 0  ? lastName =  $("#last-input").val().trim() : false;
        
        if($("#email-input").val().trim().length > 0  ) {
            email = $("#email-input").val().trim()
        } else { 
            email = false;
            var Emsg = $("<p>").text("Please provide an Email")
            $("#emailAlert").append(Emsg)
        } 

        $("#email-input").val().trim().length > 0  ? email =  $("#email-input").val().trim() : false;

        if($("#zip-input").val().trim().length == 5) {
            zipcode = parseInt($("#zip-input").val().trim())
        } else { 
            zipcode = false;
            var Zmsg = $("<p>").text("Please provide a valid zipcode")
            $("#zipcodeAlert").append(Zmsg)
        } 

        // create userInfo object
        if(username && password && firstName && email && zipcode){
            var userInfoObj = {
                "username" : username,
                "password" :password,
            }
        }

//  auth.createUserWithEmailAndPassword()
    })
// sign a user in 


// sign out 

