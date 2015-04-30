define([
  'jquery',
  'underscore',
  'backbone', 
  'views/FilterView',
  'CoursePicker',
  'text!../templates/MyHeaderTemplate.html'
], function ( $, _, Backbone, FilterView, CoursePicker, Template) {

	var MyFilterView = FilterView.extend({
	    el:       '#header',
	    
	    events: {
	        'change #my-program-selector': 'changeMyProgram',
	    },
	    
	    initialize: function (args) {
	        this.schedule = args.schedule;
	    },
	    
	    changeMyProgram: function (e) {
	        var shortname = $(e.currentTarget).val();
	        Backbone.trigger('filterMyProgram', shortname);
	    },

	    renderProgram: function() {
	    	var template = _.template(Template);
	        this.$('.form-inline').html(template({
	            'schedule' : this.schedule
	        }));
	    	
			if (CoursePicker.myProgram) {
	    		this.$('#my-program-selector').val(CoursePicker.myProgram);
	    	}

			return this;
	    },
	    
	    render: function () {
	    	this.$('#search').empty();
	        return this.renderProgram();
	    }
	    
	});

	return MyFilterView;


});