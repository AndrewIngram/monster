/**
 * The basic interface of a widget
 */
MONSTER.field = function(spec) {
	var that = {};
		
	that.callbacks = spec.callbacks,
	that.name = spec.name,
	that.verbose_name = spec.verbose_name,
	
	that.get_value = function(){
		return that.callbacks[0]();
	},
	that.set_value = function(data){
		that.callbacks[1](data);
	},	
	that.init = function(){
		
	};
	that.render = function(){
		var html = '
	};
	
	return that;
}

