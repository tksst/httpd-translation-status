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

function ctd(tr, text){
	var td = ce("td", tr);
	if(text != null){
		td.textContent = text;
	}
	return td;
}

function docUrl(ver, filename){
	var url = "http://httpd.apache.org/docs/" + ver;
	url += "/" + filename.replace( /^(.+)\.xml$/g, '$1.html' );
	return url;
}


function showMsg(text, cname){
	var e = document.getElementById("main");
	e.textContent = "";
	var foo = ce("div", e);
	foo.className = cname;
	foo.textContent = text;
}


function getVersion(){
	var h = location.hash.substr(1);
	return h == "2.0" || h == "2.2" || h == "2.4" || h == "trunk" ? h : null;
}

function moveVersion(ver){
	location.hash = "#" + ver;
	
	var e = document.getElementById("main");
	showMsg("loading...", "infomsg");

	var req = new XMLHttpRequest();
	req.open('GET', ver + ".json", true);
	req.onreadystatechange = function(){
		if(req.readyState != XMLHttpRequest.DONE){
			return;
		}
		if(req.status != 200){
			if(req.status == 0){
				showMsg("Unknown Error", "errormsg");
			}
			else{
				showMsg("HTTP " + req.status + " Error", "errormsg");
			}
			return;
		}
		e.textContent = "";
		var tb = ce("tbody", ce("table", e));
		var obj = JSON.parse(req.responseText);
		
		//ヘッダ
		{
			var tr = ce("tr", tb);
			ce("th", tr);
			for(var i = 0; i < obj["langs"].length; ++i){
				 ce("th", tr).textContent = obj["langs"][i];
			}
		}
		//ボディ
		for(var i = 0; i < obj["files"].length; ++i){
			var tr = ce("tr", tb);
			//ファイル名
			var file = obj["files"][i];
			var tdf = ce("td", tr);
			tdf.className = "filename";
			var af = ce("a", tdf);
			af.href = docUrl(ver, file["filename"]);
			af.textContent = file["filename"];
			//各言語
			for(var j = 0; j < obj["langs"].length; ++j){
				var lang = obj["langs"][j];
				var c = className(file[lang], file["en"], lang);
				ctd(tr, keta(file[lang])).className = c;
			}
		}
	};
	req.send(null);
}

window.onload = function(){
	var ver = getVersion();
	if(ver == null){
		showMsg("unknown version", "errormsg");
	}
	else{
		moveVersion(ver);
	}
	
	document.getElementById("link_trunk").onclick = function(){
		moveVersion("trunk");
		return false;
	};
	document.getElementById("link_2.4").onclick = function(){
		moveVersion("2.4");
		return false;
	};
	document.getElementById("link_2.2").onclick = function(){
		moveVersion("2.2");
		return false;
	};
	document.getElementById("link_2.0").onclick = function(){
		moveVersion("2.0");
		return false;
	};
};
