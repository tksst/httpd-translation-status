//UTF-8
function keta(num){
	return num == null ? null : String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' );
}

function createElement(tag, parent, f){
	var e = document.createElement(tag);
	if(f !== undefined && f !== null){
		f(e);
	}
	if(parent !== undefined && parent !== null){
		parent.appendChild(e);
	}
	return e;
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

function docUrl(ver, filename){
	var url = "http://httpd.apache.org/docs/" + ver;
	url += "/" + filename.replace( /^(.+)\.xml$/g, '$1.html' );
	return url;
}

function showMsg(text, cname){
	var foo = createElement("div");
	foo.className = cname;
	foo.textContent = text;
	var e = document.getElementById("main");
	e.replaceChild(foo, e.firstChild);
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
		var tb = createElement("table");
		var obj = JSON.parse(req.responseText);
		
		var langidx = new Array();
		
		var templtr =  createElement("tr");
		createElement("td", templtr, function(td){
			td.className = "filename";
			td.appendChild(createElement("a"));
		});

		createElement("tr", tb, function(tr){
			createElement("th", tr);
			
			function foobar(lang, i){
				createElement("th", tr, function(th){
					th.textContent = lang;
				});

				langidx[lang] = i + 2;

				createElement("td", templtr, function(td){
					td.className = "notranslation";
				});
			}
			foobar("en", 1);
			obj.langs.forEach(foobar);
		});
		
		//ボディ
		for(var filename in obj["files"]){
			var tr = templtr.cloneNode(true);
			//ファイル名
			var file = obj.files[filename];
			var af = tr.firstChild.firstChild;
			af.href = docUrl(ver, filename);
			af.textContent = filename;
			//英語
			tr.childNodes[1].textContent = keta(file.rev);
			//各言語
			for(var lang in file.translations){
				var td = tr.childNodes[langidx[lang]];
				td.className = className(file.translations[lang], file.rev, lang);
				td.textContent = keta(file.translations[lang]);
			}
			tb.appendChild(tr);
		}
		e.replaceChild(tb, e.firstChild);
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
