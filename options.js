var uri_pattern_list = [];
$(init);

function init(){
	console.log("init");
	reload_rule_list();
	$("#new_rule_button").click(function(){
		console.log("new rule");
		var rule_text = $("#new_rule").val();
		var parts = rule_text.split("|");
		if(parts.length == 3){
			var uri_pattern = parts[0];
			var link_selector = parts[1];
			var target_content_selector = parts[2];
			localStorage["rule:"+uri_pattern] = JSON.stringify({
				'link_selector': link_selector,
				'target_content_selector': target_content_selector
			});
			uri_pattern_list.push(uri_pattern);
			console.log(uri_pattern_list);
			localStorage['uri_pattern_list'] = JSON.stringify(uri_pattern_list);
			reload_rule_list();
		}else{
			console.log("need 3 params");
		}
	});
}

function escape_html(str){
	return str
		.replace(/&/g, '&amp;')
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;');
}

function reload_rule_list(){
	console.log("reload rule list");
	$("#rule_list").empty();
	if(localStorage['uri_pattern_list']){
		uri_pattern_list = JSON.parse(localStorage['uri_pattern_list']);
		for(var c=0;c<uri_pattern_list.length;c++){
			var patt = uri_pattern_list[c];
			if(localStorage["rule:" + patt]){
				var rule = JSON.parse(localStorage["rule:" + patt]);
				var show_string = (patt + "|" + rule['link_selector'] + "|" + rule['target_content_selector']);
				$("#rule_list").append(
					$("<div></div>")
						.append(
							$("<div></div>")
								.text(show_string)
								.css("display", "inline-block")
						).css("display", "block")
						.append(
							$("<input type=\"button\">")
								.val("Delete")
								.css("margin-left", "5px")
								.click(get_delete_action(c))
						)
				);
			}
		}
	}
}

function get_delete_action(c){
	var cb = function(){
		var idx = c;
		console.log("delete rule at index: " + idx);
		var patt = uri_pattern_list[idx];
		uri_pattern_list.splice(idx, 1);
		localStorage['uri_pattern_list'] = JSON.stringify(uri_pattern_list);
		delete localStorage['rule:' + patt];
		reload_rule_list();
	}
	return cb;
}
