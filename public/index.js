$(".delete").click(function(){
    console.log("delete buttong clicked");
    var id = $(this).attr("id");
    
    fetch(`films/film_id:${id}`, {
      method:"delete",
      headers: {'Content-Type': 'applications/json'}
    })
  
  })
  