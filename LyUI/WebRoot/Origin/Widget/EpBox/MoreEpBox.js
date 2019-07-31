InitCompriseCss(ModuleUrl+"EpBox/Css/MoreEpBox.css");
var MoreEpBox = Class.create();
MoreEpBox.prototype = Object.extend(new TBase(),{
	aXMLData : [],		//存储多个EpBox的XML数据
	aXPath :[],			//存储多个EpBox的xpath表达式
	srcObj : null,		//当前调用对象
	jCheckbox : {},		//选中的checkbox的Json对象
	jFilter : {},		//存储多个EpBox的过滤值
	/**
	 * 创建EpBox的DIV对象
	 * @param {} currObj 调用EpBox的当前对象
	 */
	createEpBoxDiv : function(currObj){
		this.srcObj = currObj;
		var position = this.evalLeft(currObj);		//获取DIV所在位置
		if( $("#showMoreEpBox").length < 1 ){
			var	epDiv = document.createElement("DIV");
			epDiv.id = "showMoreEpBox_iframe";
			epDiv.innerHTML = "<iframe width='100%' height='100%' border='0' />";
			epDiv.style.cssText = "position: absolute;z-index:2001;width:" 
								+ this.width + "px;height:" + this.height + "px;top:" 
								+ position.Top + "px;left:" + position.Left + "px";
			document.body.appendChild(epDiv);
			epDiv = document.createElement("DIV");
			epDiv.id = "showMoreEpBox";
			epDiv.style.cssText = "position: absolute;z-index:3000;"
								+ "width:"
								+ this.width + "px;height:" + this.height + "px;top:"
								+ position.Top + "px;left:" + position.Left + "px";
			epDiv.innerHTML = "<div class='buttom-group'><span class='span-button' onmouseover='moreEpBox.resultOver();' onclick='moreEpBox.resultClick(true);'>全选</span>" +
					"<span class='span-button' onmouseover='moreEpBox.resultOver()' onclick='moreEpBox.resultClick();'>反选</span>" +
					"<span class='span-button span-button-last' onmouseover='moreEpBox.resultOver();' onclick='moreEpBox.resultClick(false);'>全不选</span>" +
					"<button class='btn btn-success btn-xs' onclick='moreEpBox.filterKeydown(true);'>确定</button>" +
					"<span class='span-font'>过滤：</span>" +
					"<input type='text' class='input-text' onkeyup='moreEpBox.filter();' onkeydown='moreEpBox.filterKeydown();'  id='input_EpBoxFilter' value='' size='20'></div>" +
					"<div id='div_EpBoxContent' style='height:"+(this.height - 33)+"px;'></div>";
			document.body.appendChild(epDiv);
		}else{ 				//计算位置
			if(($("#showMoreEpBox")[0].offsetLeft + $("#showMoreEpBox")[0].offsetTop) 
				!= (position.Top + position.Left) ){
				moreEpBox.showBool = false;
			}
			$("#showMoreEpBox").css({top:position.Top,left:position.Left});
			$("#showMoreEpBox_iframe").css({top:position.Top,left:position.Left});
			$("#showMoreEpBox").show();
			$("#showMoreEpBox_iframe").show();
			$("#showMoreEpBox").width(this.width).height(this.height);
			$("#showMoreEpBox_iframe").width(this.width).height(this.height);
		}
		//过滤获得焦点
		if(this.epIsRead){		//是否可编辑
			$("#input_EpBoxFilter")[0].focus();
			if(moreEpBox.currObj.value != "" && this.jCheckbox[this.epName] == null){
				//该jqury版本不支持jqury反射$(moreEpBox.currObj).attr('value2');
				var aValue2 = moreEpBox.currObj.value2;
				if(aValue2 == null && this.epValue2 == this.epValue){
					moreEpBox.currObj.value2 =$(moreEpBox.currObj).val().replace("、","|");
					aValue2 = moreEpBox.currObj.value2;
				}
				aValue2 = aValue2==null?[]:aValue2.split("|");
					
				var aValue = moreEpBox.currObj.value.split("、");
				var jObj = {};
				for(var i = 0;i < aValue2.length;i += 1){
					jObj[aValue2[i]] = aValue[i];
				}
				this.jCheckbox[this.epName] = jObj;
			}
		}else{
			if($(this.srcObj).attr("keydown") == null){
				$(this.srcObj).bind("keydown",function(){moreEpBox.filterKeydown();});
			}
		}
		$("#input_EpBoxFilter").val(moreEpBox.jFilter[moreEpBox.epName] || "");
	},
	/**
	 * 计算EpBox的位置
	 * @param {} obj	触发EpBox的对象
	 * @return {}	返回一个存储X坐标和Y坐标的json对象
	 */
	evalLeft : function(obj){
		var left = obj.offsetLeft;					//X坐标
		var top = obj.offsetTop + obj.offsetHeight;	//Y坐标
		//如果有滚动条，则要根据滚动条来调整
		var objParent = obj.offsetParent;
		while (objParent != null && objParent.tagName != "BODY"){//objParent.tagName != "BODY"
			left += objParent.offsetLeft - objParent.scrollLeft;
			top += objParent.offsetTop - objParent.scrollTop;
			objParent = objParent.offsetParent;
		}
		var divheight = this.height;		//高度
		var divwidth = this.width;			//宽度
		if (top + divheight > document.body.clientHeight + document.body.scrollTop) {
			top = top - obj.offsetHeight - divheight;
		}
		if (left + divwidth > document.body.clientWidth + document.body.scrollLeft) {
			left = document.body.clientWidth + document.body.scrollLeft - divwidth - 20;
		}
		return {Top: top,Left: left};
	},
	/**
	 * 创建EpBox
	 * @param {} xpath 用于过滤的xpath表达式
	 */
	createEpBox : function(xpath){
		if(this.aXMLData[this.epName] == null || this.aXPath[this.epName] != xpath){
			ajaxCall({"EpName":this.epName,"XPATH":xpath==null?"":xpath},
					"Origin.Widget.EpBox.EpBox","QryData",this.setData,false);
			this.aXPath[this.epName] = xpath;
		}else{
			this.showEpBox();
		}
	},
	/**
	 * 保存从后台读取的XML数据
	 * @param {} ajax
	 */
	setData : function(ajax){
		if (xmlObject.readyState == 4 && xmlObject.status == 200) {
			var response = xmlObject;
			var node = response.responseXML.documentElement;
			if(node==null||node.xml===undefined){
				node = StrToXml(response.responseText);
			}
			if (node.selectSingleNode("RES/DAT") != null) {
				moreEpBox.aXMLData[moreEpBox.epName] = null;
			}else{
				moreEpBox.aXMLData[moreEpBox.epName] = node;
			}
			moreEpBox.showEpBox();
		}
	},
	/**
	 * 根据XML数据显示EpBox
	 */
	showEpBox : function(isFilter,value){
		var node = this.aXMLData[this.epName];
		if(node != null){
			var sValue = $("#input_EpBoxFilter").val();
			if(sValue != ""){
				isFilter = true;
				value = sValue;
			}
			var result = new StringBuffer();
			result.append("<table cellpadding='0' cellspacing='0' border='0'><tr>");
			
			var aFields = node.documentElement.selectSingleNode("Fields").childNodes;
			
			//checkbox对象Id
			var sField1 = typeof(this.epValue2) == "string" ? this.epValue2 : 
				aFields[this.epValue2].getAttribute("ColName");
			//要显示的名称		
			var sField2 = typeof(this.epValue) == "string" ? this.epValue : 
				aFields[this.epValue].getAttribute("ColName");
			
			var aValues = node.documentElement.selectSingleNode("Rows").childNodes;
			var iNum = 0;
			var iWidth = (moreEpBox.width / moreEpBox.epColumn).toFixed(0);
			for(var i = 0;i < aValues.length;i += 1){
				var sValue1 = aValues[i].getAttribute(sField1);	
				var sValue2 = aValues[i].getAttribute(sField2);
				if(isFilter){
					if(this.PYMFilter){				//拼音嘛过滤
						var sValue3 = aValues[i].getAttribute("CPYM");
						if(sValue1.indexOf(value) < 0 && sValue2.indexOf(value) < 0 
							&& sValue3.toUpperCase().indexOf(value.toUpperCase()) < 0){
							continue;
						}
					}else{
						if(sValue1.indexOf(value) < 0 && sValue2.indexOf(value) < 0){
							continue;
						}
					}
					if(iNum % moreEpBox.epColumn == 0){
						result.append("</tr><tr>");
					}
					iNum += 1;
				}else{
					if(i != 0 && i % moreEpBox.epColumn == 0){
						result.append("</tr><tr>");
					}
				}
				var checked = "";
				result.append("<td width='").append(iWidth).append("px;' valign='top'>")
					.append("<div class='checkboxDIV'><label for='chbId_").append(this.epName)
					.append("_").append(sValue1).append("' >")
					.append("<div class='label_checkbox'><input type='checkbox' name='chbName_")
					.append(this.epName).append("' id='chbId_").append(this.epName).append("_")
					.append(sValue1).append("' onclick='moreEpBox.selectCheckBox(this);' ")
					.append(checked).append(" CMC='").append(sValue2).append("' ></div>")
					.append(sValue2).append("</label></div></td>");
			}
			result.append("</tr></table>");
			$("#div_EpBoxContent").html(result.toString());
			//根据调用控件对象的value2来显示被选中的checkbox
			this.setValueByObj();
		}else{
			$("#div_EpBoxContent").html("");
		}
	},
	hiddenEpBox : function(aEvent,inTag){
		if(!inTag){
			aEvent = aEvent.srcElement || aEvent.target;
		}
		if(aEvent.disabled == false){
			//如果触发事件的父节点的id是 showMoreEpBox 则显示
			var objParent = aEvent == null ? null : aEvent.offsetParent;
			while (objParent != null){
				if(objParent.id == "showMoreEpBox"){
					break;
				}
				objParent = objParent.offsetParent;
			}
			if(moreEpBox.showBool && objParent == null){
				$("#showMoreEpBox").hide();
				$("#showMoreEpBox_iframe").hide();
				moreEpBox.showBool = false;
			}else if(!moreEpBox.showBool && moreEpBox.currObj != null){
				if(aEvent.id == moreEpBox.currObj.id){
					$("#showMoreEpBox").show();
					$("#showMoreEpBox_iframe").show();
					moreEpBox.showBool = true;
				}else{
					$("#showMoreEpBox").hide();
					$("#showMoreEpBox_iframe").hide();
				}
			}
		}
	},
	resultOver : function() {
		var id = event.srcElement;
		id.style.cssText = "color: #0055F1;text-decoration: underline;cursor: pointer;";
		id.onmouseout = function() {event.srcElement.style.cssText = "color: #0055F1;cursor: pointer;";};
	},
	/**
	 * 根据传入的Boolean值进行全选、反选、全不选的操作
	 * @param {} bool
	 * @return {Boolean}
	 */
	resultClick : function(bool) {
		var aCheckbox = $("#div_EpBoxContent :checkbox");
		if(aCheckbox.length < 0){return false;}
		for(var i = 0;i < aCheckbox.length;i += 1){
			if (bool == undefined) {
				aCheckbox[i].checked = !aCheckbox[i].checked;
			} else {
				aCheckbox[i].checked = bool;
			}
			this.selectCheckBox(aCheckbox[i]);
		}
	},
	/**
	 * checkbox对象单击事件
	 * @param {} srcObj checkbox对象
	 */
	selectCheckBox : function(srcObj) {
		if(moreEpBox.currObj.value != ""){
			//该jqury版本不支持jqury反射$(moreEpBox.currObj).attr('value2');
			//用moreEpBox.currObj.value2;
			var value2 = moreEpBox.currObj.value2;
			var aValue2 = value2==null?[]:value2.split("|");
			var aValue = moreEpBox.currObj.value.split("、");
			var jObj = {};
			for(var i = 0;i < aValue2.length;i += 1){
				jObj[aValue2[i]] = aValue[i];
			}
		}else{
			var jObj = {};
		}
		if(this.epIsRead){
			if(this.srcObj.value == ""){
				this.jCheckbox[this.epName] = null;
			}
			//获取id最后下划线之后的数据
			var CBM = srcObj.id.substring((srcObj.id.lastIndexOf("_") + 1),srcObj.id.length);
			var CMC = $(srcObj).attr("CMC");
			if(srcObj.checked){
				jObj[CBM] = CMC;
			}else{
				delete jObj[CBM];
			}
			//填充调用控件的值
			this.jCheckbox[this.epName] = jObj;
			this.setValue(jObj);
			$("#input_EpBoxFilter")[0].focus();
		}else{
			if(this.srcObj.value != ""){
				this.srcObj.value += "、";
			}
			this.srcObj.value += $(srcObj).attr("CMC");
		}
		this.epSet(this.srcObj.id);
	},
	setValue : function(jObj){
		this.srcObj.value ="";
		this.srcObj.value2="";
		for(var item in jObj){
			this.srcObj.value += jObj[item] +"、";
			this.srcObj.value2 += item +"|";
		}
		this.srcObj.value = this.srcObj.value.substring(0,this.srcObj.value.length - 1);
		this.srcObj.value2 = this.srcObj.value2.substring(0,this.srcObj.value2.length - 1);
	},
	/**
	 * 根据控件的value2的值来显示已被选中的checkbox
	 */
	setValueByObj : function(){
		//该jqury版本不支持jqury反射$(this.srcObj).attr('value2');
		//用moreEpBox.currObj.value2;
		if(this.srcObj.value != "" && this.srcObj.value2 != null){
			var aArr = this.srcObj.value2.split("|");
			for(var i = 0;i < aArr.length;i += 1){
				var id = "chbId_" + this.epName + "_" + aArr[i];
				if(this.getObj(id) != null){
					this.getObj(id).checked = true;
				}
			}
		}
	},
	filter : function(){
		var value = $("#input_EpBoxFilter")[0].value;
		this.showEpBox(true,value);
	},
	filterKeydown : function(iTag){
		if(event.keyCode == 13 || iTag){
			if($("#" + moreEpBox.epNext)[0] != null){
				$("#" + moreEpBox.epNext)[0].focus();
			}
			moreEpBox.jFilter[moreEpBox.epName] = $("#input_EpBoxFilter")[0].value;
			$("#input_EpBoxFilter")[0].value = "";
			moreEpBox.showBool = true;
			moreEpBox.hiddenEpBox(event,true);
		}
		if (event.keyCode == 0) {
			$("#showMoreEpBox").hide();
			$("#showMoreEpBox_iframe").hide();
			moreEpBox.showBool = false;
		}
	},
	/**
	 * 执行自定义方法
	 */
	epSet : function(){ 			
		
	},
	/**
	 * 因为jQuery不支持id带有小数点以及空格,所以这里用原生方法
	 * @param {} id 控件id
	 * @return {}
	 */
	getObj : function(id){
		return document.getElementById(id);
	} ,
	showJsonEpBox : function(node , isFilter){
		if(node != null){
			var sValue = $("#input_EpBoxFilter")[0].value;
			if(sValue != ""){
				isFilter = true;
				value = sValue;
			}
			var result = new StringBuffer();
			result.append("<table cellpadding='0' cellspacing='0' border='0'><tr>");
			var iNum = 0;
			var iWidth = (moreEpBox.width / moreEpBox.epColumn).toFixed(0);
			for(var i = 0;i < node.CBM.length;i += 1){
				var sValue1 = node.CBM[i];	
				var sValue2 = node.CMC[i];
				if(isFilter){
					if(this.PYMFilter){				//拼音嘛过滤
						var sValue3 = aValues[i].getAttribute("CPYM");
						if(sValue1.indexOf(value) < 0 && sValue2.indexOf(value) < 0 && sValue3.toUpperCase().indexOf(value.toUpperCase()) < 0)
							continue;
					}else{
						if(sValue1.indexOf(value) < 0 && sValue2.indexOf(value) < 0) continue;
					}
					if(iNum % moreEpBox.epColumn == 0) result.append("</tr><tr>");
					iNum += 1;
				}else{
					if(i != 0 && i % moreEpBox.epColumn == 0) result.append("</tr><tr>");
				}
				var checked = "";
				result.append("<td width='").append(iWidth).append("px;' valign='top'>")
					.append("<div class='checkboxDIV'><label for='chbId_").append(this.epName)
					.append("_").append(sValue1).append("' >")
					.append("<div class='label_checkbox'><input type='checkbox' name='chbName_")
					.append(this.epName).append("' id='chbId_").append(this.epName).append("_")
					.append(sValue1).append("' onclick='moreEpBox.selectCheckBox(this);' ")
					.append(checked).append(" CMC='").append(sValue2).append("' ></div>")
					.append(sValue2).append("</label></div></td>");
			}
			result.append("</tr></table>");
			$("#div_EpBoxContent").html(result.toString());
			//根据调用控件对象的value2来显示被选中的checkbox
			this.setValueByObj();
		}else{
			$("#div_EpBoxContent").html("");
		}
	}
});
var moreEpBox = new MoreEpBox();

$(document).click(moreEpBox.hiddenEpBox);

function getMoreEpBox(currObj,json){
	if(currObj.disabled || currObj.readOnly){
		return;
	}
	json = json == null?{}:json;
	if(json.epName == null){
		alert("epName 为空!");
		return;
	}
	//创建DIV
	moreEpBox.currObj = currObj;
	moreEpBox.dataType = json.dataType == null ? "xml" : "json";	/**新加**/
	moreEpBox.epName = json.epName;
	moreEpBox.width = json.width == null ? 320 : json.width; 	//宽度
	moreEpBox.height = json.height == null ? 200 : json.height; //高度
	moreEpBox.epNext = json.epNext;
	moreEpBox.isCache = json.isCache == undefined ? true : json.isCache;
	moreEpBox.epIsRead = json.epIsRead == undefined ? true : json.epIsRead;	//是否可编辑
	moreEpBox.epColumn = json.epColumn == null ? 2 : json.epColumn;	//分栏数
	moreEpBox.epValue = json.epValue == null ? 1 : json.epValue; 	//Ep取值的字段名
	moreEpBox.epValue2 = json.epValue2 == null ? 0 : json.epValue2;	//Ep存储的第二个值
	moreEpBox.PYMFilter = json.PYMFilter == null ? false : json.PYMFilter;
	moreEpBox.showBool = false;
	moreEpBox.createEpBoxDiv(currObj);
	if (moreEpBox.dataType == "json") {
		moreEpBox.showJsonEpBox(json.data);
	} else {
		moreEpBox.createEpBox(json.xpath);
	}
}