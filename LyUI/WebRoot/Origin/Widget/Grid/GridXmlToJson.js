var GridXmlToJson = Class.create();
GridXmlToJson.prototype = Object.extend(new LBase(), {
	Change : function(node){
		var ReJson = [];
		var FieldsValue = node.documentElement.selectSingleNode("FieldsValue").childNodes;
		var Fields = node.documentElement.selectSingleNode("Fields").childNodes;
		for(var i=0;i<FieldsValue.length;i+=1){
			var RowData = {};
			for(var j=0;j<Fields.length;j+=1){
				RowData[Fields[j].getAttribute("ColName")] = FieldsValue[i].getAttribute(Fields[j].getAttribute("ColName"));
			}
			ReJson.push(RowData);
		}
		return ReJson;
	}
});
var GridXmlToJson = new GridXmlToJson();