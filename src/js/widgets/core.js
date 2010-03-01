MONSTER.base = MONSTER.base || {};
MONSTER.widgets = MONSTER.widgets || {};

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
	
	var block_options = [];
	var block_options_by_type = {};
	
	var node = spec.node;
	
	var build_options = function(i) {
		
		var $this = $(this);
		
		var html = $('<div />').append($this.clone()).remove().html();
		var label = $this.attr('m:label');
		
		block_options_by_type[label] = html;
		
		block_options[i] = {
			label: label,
			html: html
		};
	};
	
	var container_nodes = function() {		
		return $(this).attr('m:widget') !== 'container';
	};
	
	node.widgets().filter(container_nodes).each(build_options);	
		
	node.empty();
	
	node.append(block_options[0].html);
	
	node.widgets().filter(container_nodes).each(function(i){
		spec.editor.editor_for_node($(this),undefined);
	});
	
	var select = $('<select>');
			
	for (var i=0; i < block_options.length; i++){

		var temp = block_options[i];
		
		var option = $('<option>');
		option.attr('value',i);
		option.text(temp.label);

		select.append(option);
	}		
	
	var handler = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all" style="z-index: 9999; margin: 0 0 10px; padding: 2px;"><span class="add ui-datepicker-prev ui-corner-all"><span class="ui-icon ui-icon-plus"></span></span></div>');
	
	handler.prepend(select);
	
	node.append(handler);		
	
	node.sortable({
		handle: 'span.move',
		scroll: true,
		cursorAt: 'bottom',
		tolerance: 'pointer',
		containment: 'parent'
	});

	handler.children('span.add').click(function(){
		new_node = $(block_options[select.get(0).value]['html']);
		new_node.hide();
		$(this).parent().before(new_node);

		MONSTER.widgets.block({
			'node': new_node,
			'data': undefined,
			'editor': spec.editor
		});
		
		new_node.fadeIn(400);
		return false;
	});	
	
	return that;
}

MONSTER.widgets.block = function(spec, my) {
	var that = MONSTER.base.widget(spec,my);

	var node = spec.node;

	var temp = node.widgets();
	
	temp.each(function(i){
		spec.editor.editor_for_node($(this), spec.data ? spec.data[i] : undefined);
	});
	
	var handler = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all" style="z-index: 9999; position: absolute; top: -2px; right: -2px; width: 32px; height: 16px; padding: 2px;"><span class="move ui-datepicker-prev ui-corner-all"><span class="ui-icon ui-icon-arrow-4">Move</span></span><span class="delete ui-datepicker-prev ui-corner-all"><span class="ui-icon ui-icon-trash">Remove</span></span></div>');		
	node.prepend(handler);
	
	node.css({'position': 'relative'});
	
	handler.hide();
	
	node.hover(function(){
		handler.show();
	},function(){
		handler.hide();
	});
	
	handler.children('span.delete').click(function(){
		node.fadeOut(400, function () {
    		$(this).remove();
  		});
		return false;			
	});
	
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
	
	if (spec.data) {
		spec.node.html(spec.data);
	}
	
	spec.node.editable(function(value, settings){
			return value;
		}, {

		}
	);
	
	that.get_data = function(){
		return spec.node.html();
	};
	that.render = function(){
		spec.node.html(spec.data);
	};
			
	return that;
};

MONSTER.widgets.markdown = function(spec,my){
	var my = my || {};
	var that = MONSTER.base.widget(spec,my);
	
	var converter = new Showdown.converter();
	
	if (spec.data) {
		spec.node.html(converter.makeHtml(spec.data));
	}
	
	that.node.click(function(e){
	
		e.preventDefault();
	
		var container = $('<textarea />');
		container.text(spec.data);
		
		container.dialog({
			title: 'Markdown Text',
			modal: true,
			buttons: { 
				"Ok": function() {
					spec.data = container.val();
					spec.node.html(converter.makeHtml(spec.data));
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		});
	});
	
	that.get_data = function(){
		return that.node.html();
	};
	that.render = function(){
		that.node.html(that.data);
	};
			
	return that;
};