MONSTER.base = MONSTER.base || {};
MONSTER.widgets = {};

/**
 * The basic interface of a widget
 */
MONSTER.base.widget = function(spec, my) {
	var that = {};
	
	that.editor = spec.editor;
	that.node = spec.node;
	that.data = spec.data;
	
	that.get_data = function(){
		
	};
	that.render = function(){
	
	};
	
	return that;
};

MONSTER.widgets.container = function(spec, my) {
	var that = MONSTER.base.widget(spec, my);
	
	return that;
}

MONSTER.widgets.block = function(spec, my) {
	var that = MONSTER.base.widget(spec,my);
	
	return that;
}

/**
 * This is the base interface for a widget which should use a modal dialog
 */
MONSTER.base.dialog_widget = function(spec, my) {
	var that = MONSTER.base.widget(spec, my);
	that.fields = {};
	
	my.title = 'Dialog';
	
	var prepare = function(container){
		for (var key in that.fields) {						
			if (that.fields.hasOwnProperty(key)){
				var field_node = that.fields[key].prepare();
				var field_node_wrapped = $('<div class="dialog-field" />').append(field_node);		
				container.append(field_node_wrapped);
			}
		}
	};
	
	that.write = function(container){
		for (var key in that.fields) {						
			if (that.fields.hasOwnProperty(key)){
				that.fields[key].write();
			}
		}
	};
	
	that.get_title = function(){
		return my.title;
	};
	
	that.get_data = function(){
		var result = {};

		for (var key in that.fields) {						
			if (that.fields.hasOwnProperty(key)){
				var field = that.fields[key];
				result[field.data_name] = field.get_value();
			}
		}
		
		return result;
	};
	
	that.node.click(function(e){
	
		e.preventDefault();
	
		var container = $('<div id="monster-dialog-container"></div>');
		
		prepare(container);
		
		container.dialog({
			title: that.get_title(),
			modal: true,
			buttons: { 
				"Ok": function() {
					that.write(container);
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		});
	});

	return that;	
};

/**
 * A widget for editing a single (linked) line of text, useful for headings
 *
 * <h3><a m:widget="linkedline" href="#" title="link title">Text</a></h3>
 */
MONSTER.widgets.linkedline = function(spec, my){
	my = my || {};
	var that = MONSTER.base.dialog_widget(spec, my);
	
	my.title = 'Linked Line';
	
	var n = that.node;
	
	that.fields = {
		text: MONSTER.fields.textfield({
			verbose_name: 'Text',
			callbacks: [
				function(){ return n.html(); },
				function(data) { n.html(data); }
			],
			data_name: 'text'
		}),
		href: MONSTER.fields.textfield({
			verbose_name: 'Link URL',
			callbacks: [
				function(){ return n.attr('href'); },
				function(data) { n.attr('href',data); }
			],
			data_name: 'href'	
		}),
		title : MONSTER.fields.textfield({
			verbose_name: 'Link Title',
			callbacks: [
				function(){ return n.attr('title'); },
				function(data){ n.attr('title',data); }
			],
			data_name: 'text'		
		})
	};
	return that;
}; 

/** 
 * A widget for image links:
 *
 * <a m:widget="linkedimage" href="#" title="link title"><img src="http://example.org/foo.gif" alt="Picture of a Foo" /></a>
 * 
 */
MONSTER.widgets.linkedimage = function(spec, my){
	my = my || {};
	var that = MONSTER.base.dialog_widget(spec, my);
	
	my.title = 'Linked Image';
	
	var n = that.node;
	
	that.fields = {
		src: MONSTER.fields.imagefield({
			verbose_name: 'Image',
			callbacks: [
				function(){ return n.find('img').attr('src'); },
				function(data){ n.find('img').attr('src',data); }
			],
			data_name: 'src'
		}),
		alt: MONSTER.fields.textfield({
			verbose_name: 'Alt Text',
			callbacks: [
				function(){ return n.find('img').attr('alt'); },
				function(data) { n.find('img').attr('alt',data); }
			],
			data_name: 'alt'
		}),
		href: MONSTER.fields.textfield({
			verbose_name: 'Link URL',
			callbacks: [
				function(){ return n.attr('href'); },
				function(data) { n.attr('href',data); }
			],
			data_name: 'href'
		}),
		title : MONSTER.fields.textfield({
			verbose_name: 'Link Title',
			callbacks: [
				function(){ return n.attr('title'); },
				function(data){ n.attr('title',data); }
			],
			data_name: 'title'
		})
	};
	return that;
};

/**
 * A widget to edit a single line, this is about as simple as widgets get (assuming you have a plugin like jeditable).
 *
 * <h2 m:widget="line">A line of text</h2>
 */
MONSTER.widgets.line = function(spec){
	var that = MONSTER.base.widget(spec);
	
	if (that.data) {
		that.node.html(that.data);
	}
	
	that.node.editable(function(value, settings){
			return value;
		}, {
			style: 'inherit'
		}
	);
	
	that.get_data = function(){
		return that.node.html();
	};
	that.render = function(){
		that.node.html(that.data);
	};
			
	return that;
};