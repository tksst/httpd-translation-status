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

function docUrl(ver, filename){
	var url = "http://httpd.apache.org/docs/" + ver + "/";
	url += langfile(filename).replace( /^(.+)\.xml$/g, '$1.html' );
	return url;
}

function viewvcUrl(ver, base, lang){
	var url = "http://svn.apache.org/viewvc/httpd/httpd/";
	url += ver == "trunk" ? "trunk" : ("branches/" + ver + ".x");
	url += "/docs/manual/" + langfile(base, lang);
	return url;
}

function viewvcDiffUrl(ver, base, rev, trrev, format){
	var url = viewvcUrl(ver, base) + "?r1=" + trrev + "&r2=" + rev;
	if(format !== undefined){
		url += "&diff_format=" + format;
	}
	return url;
}

function langfile(base, lang){
	if(lang === undefined){
		lang = "en";
	}
	if(base === "style/lang/"){
		return base + lang + ".xml";
	}
	if(lang == "en"){
		return base;
	}
	return base + "." + lang;
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
					if(lang == "en"){
						createElement("a", td);
					}
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
			var a = tr.childNodes[1].firstChild;
			if(file.rev == "error"){
				tr.childNodes[1].className = "error";
			}
			a.href = viewvcUrl(ver, filename);
			a.textContent = keta(file.rev);
			//各言語
			for(var lang in file.translations){
				var td = tr.childNodes[langidx[lang]];
				var trrev = file.translations[lang];
				createElement("a", td, function(a){
					a.href = viewvcUrl(ver, filename, lang);
					a.textContent = keta(trrev);
				});
				if(trrev == "error"){
					td.className = "error";
				}
				else if(file.rev == trrev){
					td.className = "uptodate";
				}
				else {
					td.className = "outdated";
					var NBSP = unescape("%u00A0");
					td.appendChild(document.createTextNode(NBSP+NBSP));
					createElement("a", td, function(a){
						a.href = viewvcDiffUrl(ver, filename, file.rev, trrev, "l");
						a.textContent = "diff";
					});
				}

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
