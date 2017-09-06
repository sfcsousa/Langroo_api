$(document).ready(function(){

  $('li').on('click', function(){
      var id = $(this).attr('id');
	  $(location).attr('href', '/content/'+id);	 
  });

});
