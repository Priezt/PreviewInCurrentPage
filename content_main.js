var localStorageX;
init();

function init(){
	console.log("PreviewInCurrentPage init");
	chrome.extension.sendRequest({'func': 'get_list'}, function(response){
		var data = response.result;
		console.log(data);
		localStorageX = JSON.parse(data);
		console.log(localStorageX);
		check_uri();
	});
}

function check_uri(){
	var uri = window.location.href;
	console.log("URI: " + uri);
	if(localStorageX['uri_pattern_list']){
		//var uri_pattern_list = JSON.parse(localStorageX['uri_pattern_list']);
		var uri_pattern_list = localStorageX['uri_pattern_list'];
		for(var c=0;c<uri_pattern_list.length;c++){
			var patt = uri_pattern_list[c];
			if(uri.indexOf(patt) >= 0){
				console.log("Pattern matched: " + patt);
				apply_injection(patt);
			}
		}
	}
}

function apply_injection(patt){
	if(localStorageX["rule:" + patt]){
		var rule = localStorageX["rule:" + patt];
		var link_selector = rule['link_selector'];
		var target_content_selector = rule['target_content_selector'];
		$(link_selector).each(function(){
			var href = $(this).attr("href");
			var gid = generate_id();
			var preview_button = $("<input type=\"button\">").val("Preview");
			var hide_button = $("<input type=\"button\">").val("Hide");
			var preview_div = $("<div></div>")
				.css("display", "block")
				.css("border-style", "solid")
				.css("border-color", "#000")
				.css("border-width", "2px")
				.css("margin", "2px")
				.css("padding", "2px")
				.attr("id", "div_" + gid)
				.hide();
			preview_button.insertAfter($(this));
			hide_button.insertAfter(preview_button);
			preview_div.insertAfter(hide_button);
			var preview_handler = create_preview_handler(gid, href, target_content_selector);
			var hide_handler = create_hide_handler(gid);
			preview_button.click(preview_handler);
			hide_button.click(hide_handler);
		});
	}
}

function create_preview_handler(gid, href, target_content_selector){
	var handler = function(){
		console.log("preview button clicked");
		var divid = "div_" + gid;
		var uri = href;
		var t_c_selector = target_content_selector;
		console.log("DIV ID: " + divid);
		console.log("div count: " + $("#" + divid).size());
		$("#"+divid)
			.empty()
			.append($("<center><progress></progress></center>"))
			.show();
		console.log("Get URI: " + uri);
		$.get(uri, get_callback_handler(divid, t_c_selector));
	}
	return handler;
}

function get_callback_handler(_divid, _target_content_selector){
	var handler = function(data){
		console.log("Get URI callback");
		var divid = _divid;
		var target_content_selector = _target_content_selector;
		var html = $(fetch_html(data));
		var content = html.find(target_content_selector);
		console.log(content);
		$("#"+divid)
			.empty()
			.append(content)
			.show();
	}
	return handler;
}

function create_hide_handler(gid){
	var handler = function(){
		console.log("hide button clicked");
		var divid = "div_" + gid;
		$("#" + divid).hide();
	}
	return handler;
}

function generate_id(){
	return "id_" + Math.round(Math.random() * 10000000);
}
