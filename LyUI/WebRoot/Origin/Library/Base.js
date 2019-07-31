/*
 * 魏霸王*/
var xmlObject; //ajax 对象全局变量，
var Class = {
		create : function(){
			return function(){
				this.initialize.apply(this,arguments);
			}
		}
}
Object.extend = function(pedestal,additional){
	for(var pty in additional){
		if(pedestal[pty]!=null){
			var tempstr = "";
			var ptyStr = pty;
			while((tempstr+="_")!=null){
				if(pedestal[tempstr+ptyStr]==null){
					pedestal[tempstr+ptyStr] = pedestal[pty];
					if(tempstr.length>1){
						var tempAce = tempstr;
						while(tempAce != "_"){
							var tempobj = pedestal[tempAce+ptyStr],tempAce = tempAce.substring(0,tempAce.length-1);
							pedestal[tempAce+"_"+ptyStr] = pedestal[tempAce+ptyStr];
							pedestal[tempAce+ptyStr] = tempobj;
						}
					}
					break;
				}
			}
		}
		pedestal[pty] = additional[pty];
	}
	return pedestal;
}
var Try = {
	these: function() {
		var returnValue;
		for (var i = 0; i < arguments.length; i++) {
			var lambda = arguments[i];
			try {
				returnValue = lambda();
				break;
			} catch (e) {}
		}
		return returnValue;
	}
};
String.prototype.isEmpty = function(){
	return /^\s*$/.test(this);
}
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.charAtPos = function(value){
	var len = this.match(new RegExp(value,"g"));
	return len?len.length:0;
}
String.prototype.replaceAll = function(pattern, replacement){
	var revalue = this;
	var index = revalue.indexOf(pattern);
	while(index != -1){
		revalue = revalue.replace(pattern, replacement);
		index = revalue.indexOf(pattern);
	}
	return revalue;
}
Date.prototype.toString = function(bool){
	var month = this.getMonth()+1;
	if(bool){
		return this.getFullYear()+"-"+(month>9?month:"0"+month)+
		"-"+(this.getDate()>9?this.getDate():"0"+this.getDate())+
		" "+(this.getHours()>9?this.getHours():"0"+this.getHours())+
		":"+(this.getMinutes()>9?this.getMinutes():"0"+this.getMinutes())+
		":"+(this.getSeconds()>9?this.getSeconds():"0"+this.getSeconds());
	}else{
		return this.getFullYear()+"-"+(month>9?month:"0"+month)+
		"-"+(this.getDate()>9?this.getDate():"0"+this.getDate());
	}
}
var LBase = Class.create();
LBase.prototype = {
		initialize : function(){
		},
		Super : function(){//继承方法
			var caller = arguments.callee.caller,name;
			for(var i in this){
				if(this[i]===caller){
					name=i;
					break;
				}
			}
			if(name == null){
				return;
			}else{
				name = name.substring(0,1)=="_"?name:"_"+name;
				return this[name].apply(this,arguments);
			}
		},
		CreateXML : function(){
			var XmlDom = Try.these(
					function(){return new ActiveXObject("MSXML2.DOMDocument")},
					function(){return new ActiveXObject("Microsoft.XMLDOM")},
					function(){return document.implementation.createDocument("", "", null)}	
				);
			XmlDom.async = false;
			XmlDom.appendChild(XmlDom.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"'));
			return XmlDom;
		},
		openWindow : function(URL,json,obj){ //对话框
			if(URL.substring(0,1) != "/"){
				URL = URL;
			}
			var width = json.width?json.width:700;
			var height = json.height?json.height:500;
			var scroll = json.scroll?json.scroll:"no";
			var cs = "dialogWidth:" + width + "px;dialogHeight:" + height + "px;scroll:" + scroll + ";help:no;resizable:yes;location=no;status=0";
			return window.showModalDialog(URL, obj?obj:"", cs);
		},
		StrToXml : function(XmlStr){
			if(XmlStr == null){
				return false;
			}
			var XmlDom,ReVal;
//			if(isIE){
				XmlDom = this.CreateXML();
				Rturn_value = XmlDom.loadXML(XmlStr);
//			}else{
//				Rturn_value = new DOMParser().parseFromString(XmlStr,"text/xml");
//			}
			return XmlDom || Rturn_value;
		},
		SetXml : function(Djson,className,TagName) {
			var doc= this.CreateXML();
			var root = doc.createElement("xml");
			var MSHd = doc.createElement("MSH");
			var MSH = root.appendChild(MSHd);
			var MSH1d = doc.createElement("MSH.1");
			var MSH1 = MSH.appendChild(MSH1d);
			var MSH2d = doc.createElement("MSH.2");
			var MSH2 = MSH.appendChild(MSH2d);
			MSH1.text=className;
			MSH2.text=TagName;
			var ASKd = doc.createElement("ASK");
			var ASK = root.appendChild(ASKd);
			for(var a in Djson){
				ASK.setAttribute(a,Djson[a]);
			}
			doc.appendChild(root);
			return doc;
		},
		/**
		 * 后台返回xml转化为json
		 */
		XmlToJson : function(node){
			var Fields = node.documentElement.selectSingleNode("Fields").childNodes;
			var FieldsValue = node.documentElement.selectSingleNode("FieldsValue").childNodes;
			var nodeJson = [];
			var children = [];
			for(var i=0;i<FieldsValue.length;i++){//数据循环
				var nodeJson_info = {};
				for(var j=0;j<Fields.length;j++){//字段循环
					var ColName = Fields[j].getAttribute("ColName");
					nodeJson_info[ColName] = FieldsValue[i].getAttribute(ColName);
				}
				nodeJson.push(nodeJson_info);
			}
			return nodeJson;
		},
		ajaxCall : function(Djson,className,TagName,hander,Bool) //ajax 二号线 ，这里采用 post 传递参数
		{
			xmlObject = new getAjaxObject();
			if (xmlObject) {
				var url = "http.dos";
				var data= this.SetXml(Djson,className,TagName);
				xmlObject.open("post", url, Bool);
				xmlObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xmlObject.onreadystatechange = hander;
				xmlObject.send(data.xml);
			}
		},
		NowDataStr : function(bool){
			var date = new Date();
			var month = date.getMonth()+1;
			if(bool&&bool!==undefined&&bool!=null){
				return date.getFullYear()+"-"+(month>9?month:"0"+month)+
				"-"+(date.getDate()>9?date.getDate():"0"+date.getDate())+
				" "+(date.getHours()>9?date.getHours():"0"+date.getHours())+
				":"+(date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes())+
				":"+(date.getSeconds()>9?date.getSeconds():"0"+date.getSeconds());
			}else{
				return date.getFullYear()+"-"+(month>9?month:"0"+month)+
				"-"+(date.getDate()>9?date.getDate():"0"+date.getDate());
			}
		}
}
function getAjaxObject() //AJAX 1号线,返回一个AJAX 对象引擎
{
	var xmlObject;
	if (window.ActiveXObject) {
		xmlObject = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		xmlObject = new XMLHttpRequest();
	}
	return xmlObject;
}
function repayFuncion(ajax) //ajax 四号线 ，这里采用 xml 接受数据，这里还涉及到xmldom编程
{
	if (xmlObject.readyState == 4 && xmlObject.status == 200) {
		var response = xmlObject;
		var node = response.responseXML.documentElement;
//		this.options.onComplete.apply(this.options.objectClass || this,[response]);
		//var o = new XMLSerializer();
		//alert(o.serializeToString(node,"text/xml"));
	}
}
