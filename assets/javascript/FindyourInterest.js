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
        alert("You have reached your limit of Interests");
    }
    
});

