/**
 * The basic interface of a widget
 */
MONSTER.field = function(spec) {
	var that = {};
	
	that.editor = spec.editor;
	that.node = spec.node;
	that.data = spec.data;
	
	that.get_data = function(){
	
	};
	that.render = function(){
	
	};
	
	return that;
}