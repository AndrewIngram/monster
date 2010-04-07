var MONSTER = function() {
	return this;
}();


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
		outerHTML: function(s) {
			return (s) ? this.before(s).remove() : $('<div>').append(this.eq(0).clone()).html();
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

MONSTER.base = MONSTER.base || {};

/**
 * Creates an instance of a monster editor. Takes a jQuery DOM node and a data hash.
 */

MONSTER.base.editor = function(spec, my) {
	var that = {};
	
	that.node = spec.node;	
	that.template = spec.node.html();
	that.data = spec.data;
	
	that.editor_for_node = function(node,data){
		var widget_name = node.attr('m:widget');
		var widget = MONSTER.widgets[widget_name];

		node.data('widget',widget({
			node: node,
			data: data,
			editor: that	
		}));
	};
	
	that.data_for_node = function(node){
		return node.data('widget').get_data();
	};
	
	that.render_node = function(node){
		return node.data('widget').render();
	};
		
	that.get_data = function(){
		var result = [];
		
		that.node.widgets().each(function(i){
			var node = $(this);
			var data = that.data_for_node(node);
			result.push(data);
		});
		return result;
	};
	
	that.render = function(callback){
		var duplicate = $('<div>'+that.template+'</div>');
		
		var temp_widgets = duplicate.widgets();
		
		that.node.widgets().each(function(i){
			var node = $(this);
			var html = that.render_node(node);

			temp_widgets.eq(i).replaceWith(html);
		});
		
		callback(duplicate.html());
		
		return duplicate;
	};
	
	that.node.widgets().each(function(i){
		var data = that.data ? that.data[i] : undefined;
		var node = $(this);
		that.editor_for_node(node,data);
	});
	
	return that;
};

MONSTER.editor = function(spec,my){
	return MONSTER.base.editor(spec,my);
};