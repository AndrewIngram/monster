/**
 * The basic interface of a widget
 */
MONSTER.widget = function(spec) {
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

/**
 * This is the base interface for a widget which should use a modal dialog
 */
MONSTER.dialog_widget = function(spec) {
	var that = MONSTER.widget(spec);
	
}

MONSTER.widgets['line'] = function(spec){
	var that = MONSTER.widget(spec);
	
	if (that.data) {
		that.node.html(that.data);
	}
	
	that.node.editable(function(value, settings){
			return value;
		}, {
			style: 'inherit',
		}
	);
	
	that.get_data = function(){
		return that.node.html();
	};
	that.render = function(){
		that.node.html(that.data);
	};
			
	return that;
}