var MONSTER = function() {

	var log_switch = false;
	
	this.enable_logging = function(){
		log_switch = true;
	};
	
	this.disable_logging = function(){
		log_switch = false;
	};
	
	this.log = function(data){
		if (log_switch) {
			console.log(data);
		}
	};
	
	return this;
}();

/**
 * Because the normal method of defining methods is ugly...
 */
Function.prototype.method = function(name, func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
		return this;
	}
};

/** 
 * Defining lots of methods at once...
 */
Function.prototype.methods = function(map) {
	for (var entry in map) {
		if (map.hasOwnProperty(entry)){
			var val = map[entry];
			this.method(entry,val);
		}	
	}
	return this;
};

/** 
 * Extend jQuery to allow us to easy find widgets.
 * Use $(':widget) to find any element with m:widget set.
 * Use node.widgets() to find the next level down of widgets (goes no further than one level of widgets).
 */
(function($) {
	$.extend($.expr[':'],{
		widget: function(elem, index, match, array){

			var $elem = $(elem);

			if ($elem.attr('m:widget')){
					return true;
			}
			return false;
		}
	});
	
	$.fn.extend({
		widgets : function() {
			var node = this;
			var temp = node.find(':widget');

			var result = temp.filter(function(i){
				var parents = $(this).parents(':widget');
				
				if (parents.length > 0) {
					var index = parents.index(node);
					
					if (index === 0) { return true; }
					return false;
				}
				return true;
			});
			
			return result;
		},
		getCSS : function() {
			if (arguments.length) {
				return $.fn.css.apply(this, arguments);
			}
		   var attr = ['font-family','font-size','font-weight','font-style','color',
		        'text-transform','text-decoration','letter-spacing','word-spacing',
		        'line-height','text-align','vertical-align','direction','background-color',
		        'background-image','background-repeat','background-position',
		        'background-attachment','opacity','width','height','top','right','bottom',
		        'left','margin-top','margin-right','margin-bottom','margin-left',
		        'padding-top','padding-right','padding-bottom','padding-left',
		        'border-top-width','border-right-width','border-bottom-width',
		        'border-left-width','border-top-color','border-right-color',
		        'border-bottom-color','border-left-color','border-top-style',
		        'border-right-style','border-bottom-style','border-left-style','position',
		        'display','visibility','z-index','overflow-x','overflow-y','white-space',
		        'clip','float','clear','cursor','list-style-image','list-style-position',
		        'list-style-type','marker-offset'];
		    var len = attr.length, obj = {};
		    for (var i = 0; i < len; i++) {
				obj[attr[i]] = $.fn.css.call(this, attr[i]);
			}
		    return obj;
		},
		getStyleString : function() {
			var map = $.fn.getCSS.call(this);
			
			var result = '';
			
			for (var entry in map) {
				if (map.hasOwnProperty(entry)){
					var val = map[entry];
					
					var temp = entry + ': ' + val + ';\n';
					result += temp;
				}	
			}
			
			return result;
		}
	});
})(jQuery);

/**
 * Creates an instance of a monster editor. Takes a jQuery DOM node and a data hash.
 */
MONSTER.editor = function(node,spec,data,build) {
	this.node = node;
	this.spec = spec;
	this.data = data;
	
	if (build) {
		this.init();
	}
};

MONSTER.editor.methods({
	init: function() {
		var ed = this;
		
		ed.node.widgets().each(function(i){
			var data = ed.data ? ed.data[i] : undefined;
			var node = $(this);
			
			ed.editor_for_node(node,data);
		});
	},
	editor_for_node : function(node,data) {
		var widget_name = node.attr('m:widget');
		var widget = MONSTER.widgets[widget_name];

		node.data('widget',widget({
			node: node,
			data: data,
			editor: this	
		}));
	},
	get_data: function() {
		var ed = this;
		var result = [];
		
		ed.node.widgets().each(function(i){
			var node = $(this);
			var data = ed.data_for_node(node);
			result.push(data);
		});
		return result;
	},
	data_for_node: function(node) {
		return node.data('widget').get_data();
	},
	render: function(callback) {
		var ed = this;
		var data = ed.build_data();
		var new_node = $('<div>' + ed.template + '</div>');
		
		ed.node.widgets().each(function(i){
			var node = $(this);
			ed.render_node(node,data[i]);
		});
		
		return new_node;
	},
	render_node: function(node, data){
		return node.data('widget').render();
	},
	revert: function() {
		
	},
	change_template: function(template) {
		
	}
});