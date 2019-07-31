/*
 * 魏霸王*/
var BassModuleUrl = "/LyUI/Origin/Widget/";
var BassDirUrl = "/LyUI/Origin/Library/";
var BassCssUrl = "/LyUI/Origin/Widget/skins/default/";
var LyCache = {
		codePath : {},
		CssPath : {},
		inherit : [
		           {url:"",parent:""}
		           ]
}
function InitComprise(scriptUrl){
	if(LyCache.codePath[scriptUrl]==undefined){
		var inheritOj = LyCache.inherit;
		for(var i=0;i<inheritOj.length;i+=1){
			if((BassModuleUrl+inheritOj[i].url)==scriptUrl){
				var parentURL = inheritOj[i].parent.split("|");
				for(var j=parentURL.length-1;j>=0;j-=1){
					var pAllpath = parentURL[j].substring(0, 7)=="Library"?"/LyUI/Origin/"+parentURL[j]:BassModuleUrl+parentURL[j];
					if(LyCache.codePath[pAllpath]==undefined){
						document.write('<script language="javascript" src="'+pAllpath+'"></script>');
						LyCache.codePath[pAllpath] = true;
					}
				}
				break;
			}
		}
		document.write('<script language="javascript" src="'+scriptUrl+'"></script>');
		LyCache.codePath[scriptUrl] = true;
	}
}
function InitCompriseCss(URL){
	if(LyCache.CssPath[URL]==null){
		document.write('<link rel="stylesheet" type="text/css" href="'+URL+'">');
		LyCache.CssPath[URL] = true;
	}
}
InitCompriseCss(BassModuleUrl+"bootstrap/css/bootstrap.css");
InitComprise("/LyUI/Origin/JQuery/jquery-1.11.3.min.js");
//InitComprise("/LyUI/Origin/JQuery/jquery-ui-1.11.4.min.js");
InitComprise(BassDirUrl+"Base.js");