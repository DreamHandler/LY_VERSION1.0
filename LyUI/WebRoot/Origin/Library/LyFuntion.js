/*
 * 魏霸王*/
Funs = {
		encrypt : function(str){//加密
			this.attr = "";
			for(var i=0;i<str.length;i+=1){
				this.attr += str.charCodeAt(i)+"L";
			}
			return this.attr;
		},
		decode : function(str){//解密
			this.attr = str.split("L");
			this.Lstr = "";
			for(var i=0;i<this.attr.length;i+=1){
				this.Lstr += String.fromCharCode(this.attr[i]);
			}
			return this.Lstr;
		},
		getNL : function(DCSNY,NOWDATE){//获取年龄
			var CSNY = (typeof DCSNY == "string")?new Date((DCSNY.indexOf("-")>-1?DCSNY.split("-").join("/"):DCSNY)):DCSNY;
			var NOW = (typeof NOWDATE == "string")?new Date((NOWDATE.indexOf("-")>-1?NOWDATE.split("-").join("/"):NOWDATE)):NOWDATE;
			var NL = NOW.getFullYear()-CSNY.getFullYear();
			if(NOW.getMonth()<CSNY.getMonth()){
				NL = NL-1;
			}
			if(NOW.getMonth()==CSNY.getMonth()&&NOW.getDate()<CSNY.getDate()){
				NL = NL-1;
			}
			return NL;
		},
		getNLD : function(DCSNY,NOWDATE){//获取年龄（精确到日）
			var CSNY = (typeof DCSNY == "string")?new Date((DCSNY.indexOf("-")>-1?DCSNY.split("-").join("/"):DCSNY)):DCSNY;
			var NOW = (typeof NOWDATE == "string")?new Date((NOWDATE.indexOf("-")>-1?NOWDATE.split("-").join("/"):NOWDATE)):NOWDATE;
			var year = NOW.getFullYear()-CSNY.getFullYear();
			var month = NOW.getMonth()-CSNY.getMonth();
			var day = NOW.getDate()-CSNY.getDate();
			if(day<=0){
				var NowDay = new Data(NOW.getFullYear(),CSNY.getMonth()+1,0);
				var daycount = NowDay.getDate();
				day = daycount-CSNY.getDate()+NOW.getDate();
				month = month-1;
			}
			if(month<=0){
				month = month+12;
				year = year-1;
			}
			return year+"年"+month+"月"+day+"日";
		},
		TurnNext : function(aEvent,Nid){//回车跳转焦点，（当前对象，跳转到的ID）
			if(aEvent.keyCode==13){
				var Obj = document.getElementById(Nid)||document.getElementById(Nid)[0];
				switch(Obj.type){
				case "text":
					if(Obj.disabled!="disabled"&&Obj.disabled!=true){
						Obj.focus();
						Obj.select();
					}
					break;
				case "radio":
					var TempObj = document.getElementsByName(Nid);
					for(var i=0;i<TempObj.length;i+=1){
						if(TempObj[i].checked){
							TempObj[i].focus();
							break;
						}
					}
					if(i==TempObj.length){
						TempObj[0].focus();
					}
					break;
				default:
					if(Obj.disabled!="disabled"&&Obj.disabled!=true){
						Obj.focus();
					}
					break;
				}
			}
		},
		OnInputReg : function(id){//控制只能输入数值，并只能有几位小数
			id = typeof(id)=="object"?$(id):$("#"+id);
			id.blur(function (){
				var tempTr = event.srcElement;
				var Tohold = tempTr.ToFix == null?0:tempTr.ToFix.length-2;
				tempTr.value = (tempTr.value==""||isNaN(parseFloat(tempTr.value)))?parseFloat("0").toFixed(Tohold):parseFloat(tempTr.value).toFixed(Tohold);
			});
			id.keypress(function (){
				switch((event.srcElement.getAttribute("ToFix")==null?0:event.srcElement.getAttribute("ToFix").length-2)){
				case 0:
					Funs.OnkeypressLoad(/^[0-9]{0,10}$/);
					break;
				case 1:
					Funs.OnkeypressLoad(/^([0-9]{0,10}\.{0,1}|[0-9]{0,10}\.{0,1}[0-9]{1})$/);
					break;
				case 2:
					Funs.OnkeypressLoad(/^([0-9]{0,10}\.{0,1}|[0-9]{0,10}\.{0,1}[0-9]{1,2})$/);
					break;
				case 3:
					Funs.OnkeypressLoad(/^([0-9]{0,10}\.{0,1}|[0-9]{0,10}\.{0,1}[0-9]{1,3})$/);
					break;
				case 4:
					Funs.OnkeypressLoad(/^([0-9]{0,10}\.{0,1}|[0-9]{0,10}\.{0,1}[0-9]{1,4})$/);
					break;
				default:
					break;
				}
			});
		},
		OnkeypressLoad : function(regExp){
			var tempTr = event.srcElement;
			var oSel = document.selection.createRange();
			var srcRange = tempTr.createTextRange();
			oSel.setEndPoint("StartToStart",srcRange);
			var num = oSel.text+String.fromCharCode(event.keyCode)+srcRange.text.substr(oSel.text.length);
			window.event.returnValue = value.test(num);
		}
}