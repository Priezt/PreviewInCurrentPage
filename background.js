console.log("register request handler");
chrome.extension.onRequest.addListener(request_handler);

function request_handler(req, sender, send_response){
	console.log("get request: " + req.func);
	if(req.func == 'get_list'){
		console.log("get list");
		var data = {};
		data['uri_pattern_list'] = [];
		if(localStorage['uri_pattern_list']){
			data['uri_pattern_list'] = JSON.parse(localStorage['uri_pattern_list']);
			for(var c=0;c<data['uri_pattern_list'].length;c++){
				var patt = data['uri_pattern_list'][c];
				if(localStorage['rule:' + patt]){
					var rule = JSON.parse(localStorage['rule:' + patt]);
					data['rule:' + patt] = rule;
				}
			}
		}
		console.log(JSON.stringify(data));
		send_response({'result': JSON.stringify(data)});
	}
}
