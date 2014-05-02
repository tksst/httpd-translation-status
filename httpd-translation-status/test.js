//UTF-8
function keta(num){
	return num == null ? null : String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' );
}

function className(value, envalue, lang){
	if(value == null){
		return "notranslation";
	}
	if(value == "error"){
		return "error";
	}
	if(lang != "en"){
		return value < envalue ? "outdated" : "uptodate"
	}
	return "unknown";
}

function ce(tagname, parent){
	var el = document.createElement(tagname)
	if(parent != null)
		parent.appendChild(el);
	return el;
}

function ctd(tr, innerHTML){
	var td = ce("td", tr);
	if(innerHTML != null){
		td.innerHTML = innerHTML;
	}
	return td;
}

function getVersion(){
	var h = location.hash.substr(1);
	return h == "2.0" || h == "2.2" || h == "2.4" || h == "trunk" ? h : null;
}

function moveVersion(ver){
	location.hash = "#" + ver;
	if(table != null){
		table.remove();
		table = null;
	}
	var req = new XMLHttpRequest();
	req.open('GET', ver + ".json", true);
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
			table = ce("table", document.getElementsByTagName("body")[0]);
			var tb = ce("tbody", table);
			var obj = JSON.parse(req.responseText);
			
			//ヘッダ
			{
				var tr = ce("tr", tb);
				ce("th", tr);
				for(var i = 0; i < obj["langs"].length; ++i){
					 ce("th", tr).innerHTML = obj["langs"][i];
				}
			}
			//ボディ
			for(var i = 0; i < obj["files"].length; ++i){
				var tr = ce("tr", tb);
				//ファイル名
				var file = obj["files"][i];
				ctd(tr, file["filename"]).className = "filename";
				//各言語
				for(var j = 0; j < obj["langs"].length; ++j){
					var lang = obj["langs"][j];
					var c = className(file[lang], file["en"], lang);
					ctd(tr, keta(file[lang])).className = c;
				}
			}
		}
	};
	req.send(null);
}

var ver = getVersion();
var table = null;
if(ver == null){
	//TODO: エラー
}
else{
	moveVersion(ver);
}
