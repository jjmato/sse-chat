var src, out, form;
$(document).ready(function(){
	
	src = new EventSource("api/chat/stream");
	out = $("#out");
	form = $("#chat_form");

	
	$("textarea[name=txt]").keypress(function(e) {
		if(!e.shiftKey && e.which==13){
		form.submit();
		}
	});
	
	function renderMsg(data){
		var spanAut = "<strong>"+data.autor+":</strong>",
			spanTxt = "<span>"+data.text+"</span>",
			spanDate = "<span class=\"date\">"+new Date(data.date).toLocaleTimeString()+"</span>",
			divMsg = "<div id=\"msg\">"+spanAut+spanTxt+spanDate+"</div>";
			out.append(divMsg);
			out.scrollTop(out.scrollHeight);
	}

	src.onmessage = function(e) {
		var data = JSON.parse(e.data);
		renderMsg(data);
	};

	$.ajax("api/chat").done(function(data){
		var data = JSON.parse(data);
		data.forEach(function(item){
			renderMsg(item);
		});
	})

	form.on("submit", function(e){
		e.preventDefault();
		$.post(	"/api/chat", form.serialize())
		.done(function( msg ) {
			console.log( "Data Saved: " + msg );
			$("textarea[name=txt]")[0].value = "";
			$("textarea[name=txt]")[0].focus();
		});
	});
});
