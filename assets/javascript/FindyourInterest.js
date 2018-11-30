var limit=3;
$(".image").on("click",function()
{
    //var state=$(this).attr("data-state");
    if ($(this).hasClass("imageselected"))
    { 
    //state=$(this).attr("data-state", "imageselected");
    $(this).removeClass("imageselected");
    limit++;
    } 
    else if(limit>0)
    {       
        $(this).addClass("imageselected");
        limit--;
        //selected.append(".image");   
        //state=$(this).attr("data-state", "notselected");
    } 
    else
    {
        alert("You have reached your limit of Interests");
    }
});
$("#create-account").on("click", function(){
    // when submit button is clicked we get values from the images with a class of imageselected to store in our database as user Interests
    var userInterests = [];
    var userInterestObject = {
        interests: userInterests
    }
$.each($('.imageselected'), function(i) {
    var interestName = $(this).attr("id")
    var interestCategory = $(this).attr("img-data")
    var interestDataObject = {
        type: interestName, 
        category: interestCategory
    }
    userInterests.push(interestDataObject);   
})
console.log(userInterestObject);
    });         