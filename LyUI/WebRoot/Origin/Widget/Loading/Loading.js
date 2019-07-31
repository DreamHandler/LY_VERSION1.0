/*
 * 魏霸王
 */
var Loading = Class.create();
Loading.prototype = Object.extend(new LBase(), {
	run : function(SMVal){
		SMVal = SMVal ==null?"数据加载中...":SMVal;
		if(this.LoadDiv==undefined){
			this.LoadDiv = $("<div align='center' style='position:absolute;background-color:#D7D7D7;width:200px;height:70px;z-index:1000;top:"+(document.body.clientHeight/5)+"px;left:"+(document.body.clientWidth/2-120)+"px;'></div>");
			var LoadDivHTML = $("<br><img src='"+BassCssUrl+"images/Loading/loading_2.gif'><br><span id='_load_Msg'>"+SMVal+"</span>");
			LoadDivHTML.appendTo(this.LoadDiv);
			this.BGDiv = $("<div style='position:absolute;top:0px;left:0px;FILTER:alpha(opacity=40);opacity:0.4;background-color:#EEEEEE;width:"+document.body.clientWidth+"px;height:"+document.body.clientHeight+"px;'></div>");
			this.LoadDiv.appendTo("body");
			this.BGDiv.insertBefore(this.LoadDiv);
		}
		$(this.LoadDiv).css({"display":""});
		$(this.BGDiv).css({"display":""});
		$(this.BGDiv).css({"z-index":"1000"});
	},
	stop : function(){
		if(this.LoadDiv!=undefined){
			$(this.LoadDiv).css({"display":"none"});
			$(this.BGDiv).css({"display":"none"});
			this.LoadDiv = undefined;
		}
	}
});
var load = new Loading();