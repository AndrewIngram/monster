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
	that.fields = {};
	
	var title = 'Dialog';
	
	var render_fields = function(container){
		for (key in that.fields) {
			var f = that.fields[key]
			
			// Get a jQuery node of the rendered field
			var rendered_field = f.render();
			container.append(rendered_field);		
		}
	};
	
	that.get_title = function(){
		return title;
	};

	return that;	
}

/** 
 * A widget for image links:
 *
 * <a m:widget="linkedimage" href="#" title="link title"><img src="http://example.org/foo.gif" alt="Picture of a Foo" /></a>
 * 
 */
MONSTER.widgets.linkedimage = function(spec){
	var that = MONSTER.dialog_widget(spec);
	var title = 'Linked Image';
	
	var n = that.node;
	
	that.fields = {
		image: MONSTER.fields.imagefield({
			verbose_name: 'Image',
			callbacks: [
				function(){ return n.find('img').attr('src') },
				function(data){ n.find('img').attr('src',data) }
			],
			data_name: 'src',	
		}),
		alt: MONSTER.fields.textfield({
			verbose_name: 'Alt Text',
			callbacks: [
				function(){ return n.find('img').attr('alt') },
				function(data) { n.find('img').attr('alt',data) },
			],
			data_name: 'alt',
		}),
		href: MONSTER.fields.textfield({
			verbose_name: 'Link URL',
			callbacks: [
				function(){ return n.attr('title') },
				function(data) { n.attr('title',data) },
			],
			data_name: 'href',
		}),
		title : MONSTER.fields.textfield({
			verbose_name: 'Link Title',
			callbacks: [
				function(){ return n.attr('title') },
				function(data){ n.attr('title',data) },
			],
			data_name: 'title',
		}),
	};

	return that;
}

/**
 * A widget to edit a single line, this is about as simple as widgets get (assuming you have a plugin like jeditable).
 *
 * <h2 m:widget="line">A line of text</h2>
 */
MONSTER.widgets.line = function(spec){
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