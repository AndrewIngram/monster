MONSTER.widgets.markdown_container = function(spec,my){
	var my = my || {};
	var that = MONSTER.base.widget(spec,my);

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
	
	var md_node = $('<div m:widget="markdown"/>');
	
	MONSTER.widgets.markdown({
		'node': md_node,
		'data': 'placeholder',
		'editor': spec.editor
	});
	
	node.append(md_node);
	
	var select = $('<select>');
			
	for (var i=0; i < block_options.length; i++){

		var temp = block_options[i];
		
		var option = $('<option>');
		option.attr('value',i);
		option.text(temp.label);

		select.append(option);
	}		
	
	var handler = $('<div class="ui-widget-header ui-helper-clearfix ui-corner-all" style="z-index: 9999; margin: 0 0 10px; padding: 2px;"><span class="add ui-corner-all"><span class="ui-icon ui-icon-plus"></span></span></div>');
	
	handler.prepend(select);
		
	node.append(handler);		
	
	md_node.sortable({
		handle: 'span.move',
		scroll: true,
		cursorAt: 'top left',
		tolerance: 'intersect',
		cancel: 'p',
		helper: 'clone',
		//placeholder: 'ui-state-highlight'
		//forcePlaceholderSize: true,
		//cursor: 'crosshair',
	});

	handler.children('span.add').click(function(){
		var new_node = $(block_options[select.get(0).value]['html']);
		new_node.hide();
		md_node.prepend(new_node);
		
		MONSTER.widgets.block({
			'node': new_node,
			'data': undefined,
			'editor': spec.editor
		});		
		
		md_node.sortable('refresh');	

		new_node.fadeIn(400);
		return false;
	});
	
	that.get_data = function(){
		return that.node.html();
	};
	that.render = function(){
		that.node.html(that.data);
	};
			
	return that;
};