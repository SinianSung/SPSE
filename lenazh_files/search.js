/*
By submiting the global search form, let's display the loader gif
*/


$(document).ready(function(){
	$("#frmOverallSearch").submit(function(e) {
		if ( $.browser.msie ) {
			$('#loadingImg').remove();
			$('#search_info_msg').append('<img src="../images/loader.gif" alt="loading..." id="loadingImg" />');
		}
		$("#search_info_msg").css("display", "inline");
		//}
	});
	
	$("#frmOverallSearch2").parent().submit(function(e) {
		if ( $.browser.msie ) {
			$('#loadingImg2').remove();
			$('#frm_info_search_msg').append('<img src="../images/loader.gif" alt="loading..." id="loadingImg" />');
		}
		$("#frm_info_search_msg").css("display", "inline");
	});
	
});	
