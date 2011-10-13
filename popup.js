var uri_pattern_list = [];
$(init);

function init(){
	console.log("init");
	if(localStorage['uri_pattern_list']){
		var uri_pattern_list = JSON.parse(localStorage['uri_pattern_list']);
		for(var c=0;c<uri_pattern_list.length;c++){
			var patt = uri_pattern_list[c];
			if(localStorage["rule:" + patt]){
				var rule = JSON.parse(localStorage["rule:" + patt]);
				var show_string = escape(patt + "|" + rule['link_selector'] + "|" + rule['target_content_selector']);
				$("#rule_list").append(
					$("<div></div>")
						.text(show_string)
						.css("display", "block")
				);
			}
		}
	}
}
