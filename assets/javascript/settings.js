auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //gathe current user information for developer visibility
        database.ref("/userinfo")
            .orderByChild("userId")
            .equalTo(firebaseUser.uid)
            .once("child_added", function (snapshot) {
                userInfo = snapshot.val();
                // set the inial value of the fields to the user information
                firstName = userInfo.firstName;
                $("#first-input").val(firstName);
                lastName = userInfo.lastName;
                $("#last-input").val(lastName);
                birthDay = userInfo.birthday;
                $("#birth-input").val(birthDay);
                zipcode = userInfo.zipcode;
                $("#zip-input").val(zipcode);
                pet = userInfo.pet;
                $("#previousPet").text(pet);
                userID = userInfo.userId;

                var NochangeUserIntrest = [userInfo.interest1, userInfo.interest2, userInfo.interest3]
                var socialLimit = 2;
                $(document).on("click", ".social", function () {
                    if ($(this).hasClass("imageselected")) {
                        $(this).removeClass("imageselected");
                        socialLimit++;
                    }
                    else if (socialLimit > 0) {
                        $(this).addClass("imageselected");
                        socialLimit--;
                    }
                    else {
                        $('#myModal').modal('show');
                    }
                });
                var profLimit = 1;
                $(document).on("click", ".professional", function () {
                    if ($(this).hasClass("imageselected")) {
                        $(this).removeClass("imageselected");
                        profLimit++;
                    }
                    else if (profLimit > 0) {
                        $(this).addClass("imageselected");
                        profLimit--;
                    }
                    else {
                        $('#myModal').modal('show');
                    }
                });
                //get values from the images with a class of imageselected
                var userInterests = [];
                function newUserInfo() {
                    userInterests = [];
                    $.each($('.imageselected'), function (i) {
                        var interestName = $(this).attr("id")
                        var interestCategory = $(this).attr("img-data")
                        var interestDataObject = {
                            type: interestName,
                            category: interestCategory
                        }
                        userInterests.push(interestDataObject);
                    })
                }

                $(document).on("click", "#save-change", function (event) {
                    event.preventDefault();
                    $(".ErrorMsg").remove();

                    // gather changed value of the fields
                    var changedfavAnimal = $("#animal").val();
                    var changedfirstName = $("#first-input").val().trim();
                    var changedlastName = $("#last-input").val().trim();
                    var changedbirthDate = $("#birth-input").val().trim();

                    if ($("#zip-input").val().trim().length == 5) {
                        var changedzipcode = parseInt($("#zip-input").val().trim())
                    } else {
                        var changedzipcode = false;
                        Zmsg = $('<p>').attr("class", "ErrorMsg").text("Please provide valid zipcode")
                        $("#zip-input").after(Zmsg)
                    }

                    function gatherNewData() {
                        newUserInfo();
                        if (userInterests.length === 0) {
                            userInterests = NochangeUserIntrest;
                        }

                        //constracting the updated user object
                        var changeduserInfoObj = {
                            "userId": userID,
                            "lastName": changedlastName,
                            "birthday": changedbirthDate,
                            "zipcode": changedzipcode,
                            "firstName": changedfirstName,
                            "pet": changedfavAnimal,
                            "interest1": userInterests[0],
                            "interest2": userInterests[1],
                            "interest3": userInterests[2]
                        }

                        // update the user information in the database
                        var updates = {};
                        updates['/userinfo/' + snapshot.key] = changeduserInfoObj;
                        return database.ref().update(updates);
                    }
                    // if zipcode value is correct create the new user object
                    if (changedzipcode) {
                        gatherNewData();
                         // move to the profile page
                         window.location.href = "profile.html";

                    }
                })
            })
    } else {
        console.log("user is not loged in")
        window.location.href = "./index.html"
    }
});