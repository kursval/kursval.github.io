define([
  'jquery',
  'underscore',
  'backbone',
  'CoursePicker',
  'text!../templates/HeaderTemplate.html',
  'bootstrap',
  'jquery-ui'
], function ( $, _, Backbone, CoursePicker, Template) {

	var FilterView = Backbone.View.extend({
	    el:             '#header',
	    
	    events: {
	        'keyup #text-filter .form-control':        'keyboardInput',
	        'click ul#program-picker li a':   'changeProgram',
	        'click ul#special-picker li a':   'changeSpecial',
	    },
	    
	    initialize: function () {
	        
	    },
	    
	    keyboardInput: function (e) {
	        var textInput = $(e.currentTarget).val();
	        Backbone.trigger('filterText', textInput);
	    },

	    changeProgram: function (e) {
	        var chosenProgram = $(e.currentTarget).text();
	        var shortname = $(e.currentTarget).data('id');
	        $('#pick-program-button').text(chosenProgram + ' ');
	        $('#pick-program-button').append($('<span class="caret"></span>'));
	        
	        Backbone.trigger('filterProgram', shortname);
	    },
	    
	    changeSpecial: function (e) {

	        var chosenSpecial = $(e.currentTarget).text();
	        var shortname = $(e.currentTarget).data('id');
	        
	        $('#pick-special-button').text(chosenSpecial + ' ');
	        $('#pick-special-button').append($('<span class="caret"></span>'));
	        
	        Backbone.trigger('filterSpec', shortname);
	    },
	    
	    emptyView: function () {
	        this.$el.empty();
	    },

	    render: function () {
	        var specials = this.collection.getAllSpecials();
	        var template = _.template(Template);
	        this.$el.html(template({
	            'specializations': specials,
	            'programs' : CoursePicker.programList
	        }));
	        var p = _.findWhere(CoursePicker.programList, { 'id': CoursePicker.programName});
	        if (p) {
	            $('#pick-program-button').data(p.id);
	            $('#pick-program-button').text(p.name + ' ');
	            $('#pick-program-button').append($('<span class="caret"></span>'));        
	        }
	        
	        return this;
	    }
	});

	return FilterView;


});