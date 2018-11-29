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

