define([
  'jquery',
  'underscore',
  'backbone', 
  'views/FilterView',
  'controller/Controller',
  'text!../templates/MyHeaderTemplate.html'
], function ( $, _, Backbone, FilterView, Controller, Template) {

	var MyFilterView = FilterView.extend({
	    el:       '#header',
	    
	    events: {
	        'click ul#my-program-picker li a': 'changeMyProgram',
	    },
	    
	    initialize: function (args) {
	        this.schedule = args.schedule;
	    },
	    
	    changeMyProgram: function(e) {
	        var chosenProgram = $(e.currentTarget).text();
	        var shortname = $(e.currentTarget).data('id');
	        
	        $('#pick-my-program-button').text(chosenProgram + ' ');
	        $('#pick--myprogram-button').append($('<span class="caret"></span>'));
	        
	        Backbone.trigger('filterMyProgram', shortname);
	    },
	    
	    render: function () {
	        this.$el.empty();
	        var template = _.template(Template);
	        this.$el.append(template({
	            'schedule' : this.schedule
	        }));
	        
	        var p = _.findWhere(Controller.programList, { 'id': Controller.myProgram});
	        if (p) {
	            $('#pick-my-program-button').data(p.id);
	            $('#pick-my-program-button').text(p.name + ' ');
	            $('#pick-my-program-button').append($('<span class="caret"></span>'));        
	        }
	        
	    }
	    
	});

	return MyFilterView;


});