/**
 * The basic interface of a widget
 */
MONSTER.field = function(spec, my) {
	var that = {};
	my = my || {};
	var field_node;
		
	that.callbacks = spec.callbacks,
	that.data_name = spec.data_name,
	that.verbose_name = spec.verbose_name,
	
	that.get_value = function(){	
		return that.callbacks[0]();
	},
	that.set_value = function(data){
		try {
			that.callbacks[1](data);
		}
		catch(e) {
			// Uh oh
		}	
	},
	
	// Prepares the widget for rendering and defines a callback to populate it with data
	that.prepare = function(){
		var html = '<label for="dialog-field-' +that.data_name+ '">'+that.verbose_name+'</label><input name="dialog-field-'+that.data_name+'"></input>';
		var data = that.get_value();
		
		that.field_node = $(html);
		
		if (data) {
			that.field_node.filter('input').val(data);
		};
		
		return that.field_node;
	};
	
	// Returns a value from the field (and calls the second callback)
	that.write = function(){
		that.set_value(that.field_node.filter('input').val());
	};
	
	return that;
}

MONSTER.fields.textfield = function(spec,my){
	return MONSTER.field(spec,my);
};

