var limit=3;
$(".image").on("click",function()
{
    
    if ($(this).hasClass("imageselected"))
    { 
    
    $(this).removeClass("imageselected");
    limit++;
    } 
    else if(limit>0)
    {       
        $(this).addClass("imageselected");
        limit--;
        
    } 
    else
    {
        
        $('#myModal').modal('show');
    }
});
$("#create-account").on("click", function(){
    // when submit button is clicked we get values from the images with a class of imageselected to store in our database as user Interests
    var userInterests = [];
    var userInterestObject = {
        interests: userInterests
    }
$.each($('.imageselected'), function(i) {
    var interestName = $(this).attr("id");
    var interestCategory = $(this).attr("img-data");
    var interestDataObject = {
        type: interestName, 
        category: interestCategory
    };
    userInterests.push(interestDataObject);   
});
console.log(userInterestObject);
database.ref("/userinfo").push(userInterestObject);
    });         