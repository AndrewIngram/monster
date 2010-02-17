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
			return data;
		}
		catch(e) {
			// Uh oh
		}	
	},
	
	// Renders the widget using the getter callback function to find the data
	that.render = function(){
		var html = '<label for="dialog-field-' +that.data_name+ '">'+that.verbose_name+'</label><input name="dialog-field-'+that.data_name+'"></input>';
		var data = that.get_value();
		
		field_node = $(html);
		
		if (data) {
			field_node.find('input').val(data);
		};
		
		return field_node;
	};
	
	// Returns a value from the field (and calls the second callback)
	that.to_data= function(){
		return that.set_value(that.field_node.find('input').val());
	};
	
	return that;
}

MONSTER.fields.textfield = function(spec,my){
	return MONSTER.field(spec,my);
};

