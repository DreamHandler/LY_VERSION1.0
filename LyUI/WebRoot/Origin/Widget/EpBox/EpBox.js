InitCompriseCss(ModuleUrl+"EpBox/Css/EpBox.css");
var EpBox = Class.create();
EpBox.prototype = Object.extend(new TBase(),{
	EpboxData:[],
	xpath :[],
	ThisGrid :[],
	showBool: false,
	createGrid : function(id,columns,options){
		EpBox.prototype.ThisGrid[id] = this;
		this.result = null; //数据集合
		this.choiceRow = []; //选择的行
		this.element = $("#"+id).empty();
		this.columns = columns;
		this.headerHeight = 25;
		this.eleId = id;
		this.createDiv();
	},
	createColumnHeaders1 : function(){
		var rowHtml = new StringBuffer();
		var countWidth = 0;
		rowHtml.append("<table cellpadding='0' cellspacing='0' border='0' class='epBox_Table'><tr>");
		this.resultTable = "<COLGROUP>";
		for(var i = 0;i < this.columns.length;i += 1){
			var column = this.columns[i];
			//宽度为-1,表示不显示
			if(parseInt(column.width) != -1){
				var colWidth = (column.width == null?50:parseInt(column.width));
				rowHtml.append("<th valign='middle' width='" + colWidth + "px'>" + column.name + "</th>");
				this.resultTable += "<COL style='width:" + (colWidth + 1) + "px'/>";
				countWidth += colWidth; 
			}
		}
		this.resultTable += "</COLGROUP>";
		var spWidth = this.width - countWidth;
		spWidth = spWidth<17?16:spWidth;
		rowHtml.append("<th width='" + spWidth + "px'></th></tr></table>");
		this.resultTable = "<div style='width:" + (countWidth + 2) + "px;'><table id='" + this.eleId + "_datas' cellpadding='0' cellspacing='0' border='0' class='epBoxRow_Table'>" + this.resultTable;
		this.headDiv.html("<div style='width:" + (countWidth + spWidth + 3) + "px;height:" + this.headerHeight + "px'>" + rowHtml.toString() + "</div>");
	},
	createColumnHeaders : function(){
		var rowHtml = new StringBuffer();
		var countWidth = 0;
		rowHtml.append("<table class='table table-bordered table-hover'><thead><tr>");
		this.resultTable = "<COLGROUP>";
		for(var i = 0;i < this.columns.length;i += 1){
			var column = this.columns[i];
			//宽度为-1,表示不显示
			if(parseInt(column.width) != -1){
				var colWidth = (column.width == null?50:parseInt(column.width));
				rowHtml.append("<th class='center' width='" + colWidth + "px'>" + column.name + "</th>");
				this.resultTable += "<COL style='width:" + (isIE?colWidth:colWidth + 1) + "px'/>";
				countWidth += colWidth; 
			}
		}
		this.resultTable += "</COLGROUP>";
		var spWidth = this.width - countWidth;
		spWidth = spWidth<17?16:spWidth;
		rowHtml.append("<th width='" + spWidth + "px'></th></tr></thead></table>");
		this.resultTable = "<div style='width:" + (countWidth +2) + "px;'><table id='" + this.eleId + "_datas' cellpadding='0' cellspacing='0' border='0' class='epBoxRow_Table'>" + this.resultTable;
		this.headDiv.html("<div style='width:" + (countWidth + spWidth + 3) + "px;height:" + this.headerHeight + "px'>" + rowHtml.toString() + "</div>");
	},
	createDiv : function(){
		this.headDiv = $("<div style='float:left;'/>").height(this.headerHeight).width(this.width).css("overflow","hidden").appendTo(this.element);
		this.resultDiv = $("<div/>").width(this.width).height(this.height - this.headerHeight).css("overflow-y","scroll").css("overflow-x","hidden").appendTo(this.element);
		this.createColumnHeaders1(); //创建head
//		this.createColumnHeaders(); //创建head
		var _this = this;
		this.resultDiv.scroll(function(){
			_this.headDiv.scrollLeft(_this.resultDiv.scrollLeft());
		});
	},
	showResult : function(datas) {
		var align,dataValue;
		if(datas.length == null){ //判断类型
			if(datas.documentElement != null){
				datas = datas.documentElement;
			}
			datas = datas.selectSingleNode("Rows"); 
			datas = datas.childNodes;
		}
		this.result = datas;
		if (this.result.length != 0) {
			var data = new StringBuffer();
			data.append(this.resultTable);
			for (var i = 0; i < this.result.length; i += 1) {
				data.append("<tr Ix='"+i+"' grid='"+this.eleId+"' onmouseover='EpBoxEvent.mover(this)'>");
				for ( var j = 0; j < this.columns.length; j += 1) {
					var column = this.columns[j];
					if(parseInt(column.width) != -1){
						data.append("<td align='center'>" + datas[i].getAttribute(column.fieldname) + "</td>");
					}
				}
				data.append("</tr>");
			}
			data.append("</table></div>");
			this.resultDiv.html(data.toString());
		} else {	
		}
	},
	rows : function(){
		var rowobj = $("#" + this.eleId + "_datas")[0];
		return rowobj==null?null:rowobj.rows;
	},
	keyUp : function(Fields,aEvent){ //EPBOX 接收外部的onkeyup事件
		if(aEvent.keyCode != 40 && aEvent.keyCode != 38){
			var AValue = (aEvent.srcElement || aEvent.target).value;
			this.filter(Fields, AValue, aEvent);
		}
	},
	keyDown : function(aEvent){
		switch (aEvent.keyCode) {
		case 40: //down
			if(this.choiceRow[0] == null ){ //如果当前没有选中行，则选中第一行
				if(this.rows()==null){return;}
				this.choiceRow[0] = this.rows()[0];
				$(this.choiceRow[0]).css({background:"#0055F1",color:"#ffffff"});
			}else{
				var inRow = EpBoxEvent.isDisplay($(this.choiceRow[0]),"next");
				if(inRow != null && inRow.attr("Ix") != null){
					$(this.choiceRow[0]).css({background:"",color:"#000000"});
					inRow.css({background:"#0055F1",color:"#ffffff"});
					this.choiceRow[0] = inRow[0];
				}else
					return;
				EpBoxEvent.setScrollTop(this,"down",inRow[0]);
			}
			break;
		case 38: //up
			if(this.choiceRow[0] != null ){ //如果当前没有选中行，则选中第一行
				var inRow = EpBoxEvent.isDisplay($(this.choiceRow[0]),"prev");
				if(inRow != null && inRow.attr("Ix") != null){
					$(this.choiceRow[0]).css({background:"",color:"#000000"});
					inRow.css({background:"#0055F1",color:"#ffffff"});
					this.choiceRow[0] = inRow[0];
				}else
					return;
				EpBoxEvent.setScrollTop(this,"up",inRow[0]);
			}
			break;
		case 13 : //回车选中值
			if(!epBox.loadBool)return;
			if(epBox.choiceRow[0] == null ){
				if(epBox.epNext == ""){
					if(epBox.showBool){
						$("#showEpBox").hide();
						$("#showEpBox_iframe").hide();
						epBox.showBool = false;
					}else{
						$("#showEpBox").show();
						$("#showEpBox_iframe").show();
						epBox.showBool = true;
					}
				}else{
					$("#showEpBox").hide();
					$("#showEpBox_iframe").hide();
					epBox.showBool = false;
					var Obj = $("#"+epBox.epNext)[0] || document.getElementsByName(epBox.epNext)[0];
					switch (Obj.type) {
					case "text":
						if(Obj.disabled != "disabled"){ Obj.select(); }
						break;
					case "radio":
						var TempObj = document.getElementsByName(epBox.epNext);
						for ( var i = 0; i < TempObj.length; i += 1) {
							if (TempObj[i].checked) {
								TempObj[i].focus();
								break;
							}
						}
						if(i == TempObj.length){
							TempObj[0].focus();
						}
						break;
					default:
						if(Obj.disabled !="disabled"){ Obj.focus(); }
					break;
					}
				}
			}else{
				EpBoxEvent.epClick(aEvent,$(this.choiceRow[0]));
			}
			break;
		}
	},
	filter : function(Fields,AValue,aEvent){ //过滤
		if(this.filterTag && this.loadBool && this.result != null && this.result.length > 0 && Fields != ""){
			var rows = this.rows();
			var fieldSet,Cvalue,firstRow = null;
			if(AValue!=null)
				AValue = AValue.toUpperCase();
			if(Fields != "*"){ 
				fieldSet = Fields.split("|");
			}
			for(var i=0;i<this.result.length;i+=1){
				Cvalue = "";
				if(Fields == "*"){
					for(var j=0;j<this.columns.length;j+=1){
						if(!this.columns[j].IdfCol)
							Cvalue += "|" + this.result[i].getAttribute(this.columns[j].fieldname);
					}
				}else{
					for(var j=0;j<fieldSet.length;j+=1)
						Cvalue += "|" + this.result[i].getAttribute(fieldSet[j]);
				}
				Cvalue = Cvalue.toUpperCase();
				if(Cvalue.indexOf(AValue) == -1){
					rows[i].style.display = "none";
				}else{
					if(firstRow == null)
						firstRow = rows[i];
					rows[i].style.display = "";
				}
			}
			epBox.setRow(firstRow);
		}
	},
	setRow : function(row){
		var rowObj = this.rows();
		if(rowObj == null)return;
		if(row == null){
			epBox.choiceRow[0] = null;
			return;
		}
		var $aRow = row==null?$(rowObj[0]):$(row);
		$aRow.css({background:"#0055F1",color:"#ffffff"});
		if(epBox.choiceRow[0] != null && epBox.choiceRow[0] != $aRow[0]){
			$(epBox.choiceRow[0]).css({background:"",color:"#000000"});
		}
		epBox.choiceRow[0] = $aRow[0];
	},
	hiddenEpBox : function(aEvent,inTag){
		if(!inTag)
			aEvent = aEvent.srcElement || aEvent.target;
		//兼容高版本jQuery
		var isDisabled = $(aEvent).attr("disabled");
		isDisabled = isDisabled == undefined || isDisabled == "disabled" ? $(aEvent).prop("disabled") : isDisabled;
//		不用上面的语句则要加一个判断  isDisabled == undefined
		if(isDisabled == false){	
			if(epBox.showBool && aEvent != epBox.currObj){
				$("#showEpBox").hide();
				$("#showEpBox_iframe").hide();
				epBox.showBool = false;
			}else if(aEvent == epBox.currObj){
				$("#showEpBox").show();
				$("#showEpBox_iframe").show();
				epBox.showBool = true;
			}
		}
	},
	createEpBox : function(xpath){ //创建EPBOX
		if(this.EpboxData[this.epName] == undefined || epBox.xpath[this.epName] != xpath){
			ajaxCall({"EpName":this.epName,"XPATH":xpath==null?"":xpath},
					"Origin.Widget.EpBox.EpBox","QryData",this.setData,false);
			epBox.xpath[this.epName] = xpath;
		}else{
			this.showEpBox();
		}
	},
	setData : function(ajax){
		if (xmlObject.readyState == 4 && xmlObject.status == 200) {
			var response = xmlObject;
			var node = response.responseXML.documentElement;
			if(node==null||node.xml===undefined){
				node = StrToXml(response.responseText);
			}
			if (node.selectSingleNode("RES/DAT") != null) {
				epBox.EpboxData[epBox.epName] = null;
			}else{
				epBox.EpboxData[epBox.epName] = node;
			}
			epBox.showEpBox();
		}
	},
	showEpBox : function(){
		var node = this.EpboxData[this.epName];
		if(node != null){
			var columns = [],epWidth=0;
			var fileds = node.documentElement.selectSingleNode("Fields").childNodes;
			for(var i = 0;i < fileds.length;i += 1){
				columns[i] = {};
				columns[i].name = fileds[i].getAttribute("name");
				if(epBox.defaultWidth&&epBox.defaultWidth instanceof Array&&epBox.defaultWidth.length==fileds.length){
					columns[i].width = epBox.defaultWidth[i];
				}else{
					columns[i].width = fileds[i].getAttribute("width");
				}
				epWidth += parseInt(columns[i].width) + 1; 
				columns[i].fieldname = fileds[i].getAttribute("ColName");
			}
			this.width = this.width == null?epWidth+16:this.width;
			this.createEpBoxDiv();
			this.createGrid("showEpBox", columns, {});
			this.showResult(node);
			//if(epBox.isEmpty)epBox.setRow();
			epBox.loadBool = true;
			epBox.setRow();
			if(epBox.currObj.value != "")
				epBox.filter("*", epBox.currObj.value, null);
			epBox.showBool = true;
		} else {
			alert("无相关信息，请检测ep配置！")
		}
	},
	createEpBoxDiv : function(){
		var positi = this.evalLeft(this.currObj);
		if(positi.Top < 0){
			positi.Top = this.height + positi.Top + 20;
		}
		if( $("#showEpBox").length < 1 ){
			var	epDiv = document.createElement("DIV");
				epDiv.id = "showEpBox_iframe";
				epDiv.innerHTML = "<iframe width='100%' border=0 height='100%' />";
				epDiv.style.cssText = "position: absolute;z-index:9998;width:" + (this.width+2) + "px;height:" + (this.height+2) + "px;top:"+positi.Top+"px;left:"+positi.Left+"px";
			document.body.appendChild(epDiv);
			epDiv = document.createElement("DIV");
			epDiv.id = "showEpBox";
			epDiv.className = "showEpBox";
			epDiv.style.cssText = "padding:0;position: absolute;z-index:9999;width:" + (this.width+2) + "px;height:" + (this.height+2) + "px;top:"+positi.Top+"px;left:"+positi.Left+"px";
		
			document.body.appendChild(epDiv);
		}else{ //计算位置
			$("#showEpBox").css({top:positi.Top,left:positi.Left});
			$("#showEpBox_iframe").css({top:positi.Top,left:positi.Left});
			$("#showEpBox").show();
			$("#showEpBox_iframe").show();
			$("#showEpBox").width(this.width).height(this.height);
			$("#showEpBox_iframe > iframe").width(this.width).height(this.height);
		}
	},
	evalLeft : function(obj){
//		if(navigator.userAgent.indexOf('MSIE 8.0') > -1 || navigator.userAgent.indexOf('MSIE 7.0') > -1){ 
//			var left = obj.offsetLeft;
//			var top = obj.offsetTop + obj.offsetHeight;
//			var objParent = obj.offsetParent;
//			while (objParent != null && objParent.tagName != "BODY"){
//				left += objParent.offsetLeft - objParent.scrollLeft;
//				top += objParent.offsetTop - objParent.scrollTop;
//				objParent = objParent.offsetParent;
//			}
//		}else{
			var top = $(obj).offset().top;
			var left = $(obj).offset().left;
			var divheight = this.height;
			var divwidth = this.width;
			if (top + divheight > document.documentElement.clientHeight + document.body.scrollTop) {
				top = top - divheight;
			}else{
				top = top + obj.offsetHeight;
			}
			if (left + divwidth > document.body.clientWidth + document.body.scrollLeft) {
				left = document.body.clientWidth + document.body.scrollLeft - divwidth - 20;
			}
//		}
		return {Top: top,Left: left};
	},
	epSet : function(){ //执行自定义方法
		
	},
	blur : function(aEvent){
		if(!epBox.loadBool || epBox.choiceRow[0] == null)return;
		if(epBox.isEmpty){
			EpBoxEvent.epClick(aEvent, $(epBox.choiceRow[0]));
		}else{
			//清空属性
			if(epBox.isInput){
				if(epBox.defAttr != null){
					$(epBox.currObj).attr(isNaN(parseInt(epBox.defAttr))?epBox.defAttr:"epDef","");
				}
				if(epBox.epJson != null && epBox.epJson.length > 0){
					for(var i=0;i<epBox.epJson.length;i+=1){
						$("#"+epBox.epJson[i].id).val("");
					}
				}
				return;
			}
			if(epBox.currObj.value == ""){
				if(epBox.defAttr != null){
					$(epBox.currObj).attr(isNaN(parseInt(epBox.defAttr))?epBox.defAttr:"epDef","");
				}
				if(epBox.epJson != null && epBox.epJson.length > 0){
					for(var i=0;i<epBox.epJson.length;i+=1){
						$("#"+epBox.epJson[i].id).val("");
					}
				}
			}else{
				if(epBox.defAttr != null || epBox.epJson != null){
					EpBoxEvent.epClick(aEvent, $(epBox.choiceRow[0]));
				}
			}
		}
	}
});
var epBox = new EpBox();
$(document).click(epBox.hiddenEpBox);
function getEpBox(currObj,json){
	json = json == null?{}:json;
	if(json.epName == null){
		alert("epName 为空！");
		return;
	}
	epBox.epName = json.epName;
	epBox.currObj = currObj;
	epBox.width = json.epWidth; //epwidth
	epBox.defaultWidth = json.defaultWidth; //参数设置EP列宽度
	epBox.height = json.epHeight == null?200:json.epHeight; //高度
	epBox.epValue = json.epValue == null?1:json.epValue; //Ep取值的字段名
	epBox.epNext = json.epNext == null?"":json.epNext; //回车跳转
	epBox.isEmpty = json.isEmpty == null?false:json.isEmpty; //是否强制不为空
	epBox.isInput = json.isInput == null?false:json.isInput; //是否支持输入，组合参数,与isEmpty,defAttr
	epBox.filterTag = json.filterTag == null?true:json.filterTag; //是否强制不为空
	epBox.defAttr = json.defAttr; //自定义属性
	epBox.epJson = json.epJson; //关联赋值的控件[{id:'',value:1},{id:'',value:0}]
	epBox.epResult = json.epResult;//结果集支持 
	//内部使用
	epBox.upValue = currObj.value;
	epBox.loadBool = false;
	if(epBox.epResult == null){
		epBox.createEpBox(json.xpath);
	}else{
		epBox.EpboxData[epBox.epName] = json.epResult;
		epBox.showEpBox();
	}
	var evtents = $(currObj).data("events") || $._data(currObj,"events");  
	if(evtents == null || evtents["keyup"] == null){
		$(currObj).keyup(function(aEvt){
			epBox.keyUp("*",aEvt);
		});
	}
	if(evtents == null || evtents["keydown"] == null){
		$(currObj).keydown(function(aEvt){
			epBox.keyDown(aEvt);
		});
	}
	if(evtents == null || evtents["blur"] == null){
		$(currObj).blur(function(aEvt){
			epBox.blur(aEvt);
		});
	}
}
var StylePath = "";
var EpBoxEvent = {
	picPath : StylePath+"EpBox/",	
	mover : function(aRow){
		var $aRow = $(aRow);
		$aRow.css({background:"#0055F1",color:"#ffffff"});
		if(epBox.choiceRow[0] != aRow){
			$(epBox.choiceRow[0]).css({background:"",color:"#000000"});
		}
		$aRow.click(function(aEvent){
			EpBoxEvent.epClick(aEvent,$aRow);
		});
		epBox.choiceRow[0] = aRow;
	},
	epClick : function(aEvent,$aRow){ //ep的单击事件
		var data = epBox.result[$aRow.attr("Ix")];
		var aValue = "",currobj = $(epBox.currObj);
		if(isNaN(parseInt(epBox.epValue))){
			aValue = data.getAttribute(epBox.epValue);
		}else{
			//用显示列标记序号
			var columns = [],colIndex = 1;
			for(var i=0;i<epBox.columns.length;i+=1){
				var column = epBox.columns[i];
				if(parseInt(column.width) != -1){
					columns.push(column);
				}
			}
			aValue = data.getAttribute(columns[parseInt(epBox.epValue)].fieldname);
			
//			aValue = data.attributes[parseInt(colIndex)].value;
		}
		currobj.val(aValue);
		if(epBox.defAttr != null){
			if(isNaN(parseInt(epBox.defAttr)))
				currobj.attr(epBox.defAttr,data.getAttribute(epBox.defAttr));
			else{
				currobj.attr("epDef",data.attributes[parseInt(epBox.defAttr)].value);
			}
		}
		if(epBox.epJson != null && epBox.epJson.length > 0){
			for(var i=0;i<epBox.epJson.length;i+=1){
				var obj = epBox.epJson[i];
				if(isNaN(parseInt(obj.value))){
					$("#"+obj.id).val(data.getAttribute(obj.value));
				}else{
					$("#"+obj.id).val(data.attributes[parseInt(obj.value)].value);
				}
			}
		}
		epBox.epSet(data,epBox.currObj.id);
		if(epBox.epNext == ""){
			if(epBox.showBool){
				$("#showEpBox").hide();
				$("#showEpBox_iframe").hide();
				epBox.showBool = false;
			}else{
				$("#showEpBox").show();
				$("#showEpBox_iframe").show();
				epBox.showBool = true;
			}
		}else{
			$("#showEpBox").hide();
			$("#showEpBox_iframe").hide();
			epBox.showBool = false;
			var Obj = $("#"+epBox.epNext)[0] || document.getElementsByName(epBox.epNext)[0];
			switch (Obj.type) {
			case "text":
				if(Obj.disabled != "disabled"){ Obj.select(); }
				break;
			case "radio":
				var TempObj = document.getElementsByName(epBox.epNext);
				for ( var i = 0; i < TempObj.length; i += 1) {
					if (TempObj[i].checked) {
						TempObj[i].focus();
						break;
					}
				}
				if(i == TempObj.length){
					TempObj[0].focus();
				}
				break;
			default:
				if(Obj.disabled !="disabled"){ Obj.focus(); }
			break;
			}
		}
	},
	isDisplay : function(obj,inTag){ //判断是否隐藏
		var temObj = obj;
		if(inTag == "prev"){
			while((obj = obj.prev()).length > 0 )
				if(obj.css("display") != "none")break;
		}else if(inTag == "next"){
			while((obj = obj.next()).length > 0 )
				if(obj.css("display") != "none")break;
		}
		return (obj==null?temObj:obj);
	},
	setScrollTop : function(gridThis,inTag,inRow){
		var showResult = gridThis.resultDiv[0];
		if(inTag == "up"){
			if (inRow.offsetTop < showResult.scrollTop) {
				showResult.scrollTop = inRow.offsetTop;
			}
		}else if(inTag == "down"){
			var height = showResult.clientHeight - inRow.offsetHeight - 1;
			if (inRow.offsetTop > showResult.scrollTop + height){
				showResult.scrollTop = inRow.offsetTop - height;
			}
		}
	}
};