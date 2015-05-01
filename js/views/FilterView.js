define([
  'jquery',
  'underscore',
  'backbone',
  'CoursePicker',
  'text!../templates/ProgramSelectorTemplate.html',
  'text!../templates/SpecialSelectorTemplate.html',
  'text!../templates/SearchFilterTemplate.html',
  'text!../templates/FilterInitTemplate.html',
  'bootstrap',
  'jquery-ui'
], function ( $, _, Backbone, CoursePicker, ProgramTemplate, SpecialTemplate, SearchTemplate, FilterInitTemplate) {

	var FilterView = Backbone.View.extend({
	    el:             '#header',
	    
	    events: {
	        'keyup #text-filter .form-control': 'keyboardInput',
	        'change #program-selector': 		'changeProgram',
	        'change #special-selector': 		'changeSpecial'
	    },

	    initialize: function () {
	        
	    },
	    
	    keyboardInput: function (e) {
	        var textInput = $(e.currentTarget).val();
	        Backbone.trigger('filterText', textInput);
	    },

	    changeProgram: function (e) {
	        var shortname = $(e.currentTarget).val();
	        var chosenProgram = e.target.options[e.target.selectedIndex].text;
	        Backbone.trigger('filterProgram', shortname);
	    },
	    
	    changeSpecial: function (e) {
	        var shortname = $(e.currentTarget).val();
	        Backbone.trigger('filterSpec', shortname);
	    },
	    
	    emptyView: function () {
	    	//this.$('.form-inline').empty();
	    	//this.$('#special-selector').empty();
	    	//this.$('#program-selector').empty();
	    	//this.$('#search').empty();
	    	//this.$('.form-inline').html('<h1>Kursplan <small>Översikt</h1>');
	        this.$el.empty();
	    },

	    renderProgram: function() {
	    	var template = _.template(ProgramTemplate);
			this.$('.form-inline').append(template({
	            'programs' : CoursePicker.programList
	        }));
	    	
			if (CoursePicker.programName)
	    		this.$('#program-selector').val(CoursePicker.programName);

			return this;
	    },

	    renderSpecial: function() {
	    	this.$('special-selector').empty();
	    	var specials = this.collection.getAllSpecials();
	    	var template = _.template(SpecialTemplate);
			this.$('.form-inline').append(template({
	            'specializations': specials,
	        }));
			return this;
	    },

	    renderSearch: function() {
	    	var template = _.template(SearchTemplate);
			this.$('#search').html(template({}));
			return this;
	    },

	    render: function () {	    	
	    	this.$el.html(_.template(FilterInitTemplate)());
	    	//this.$('.form-inline').empty();
	        this.renderProgram();
	        this.renderSpecial();
	        this.renderSearch();
	        
	        return this;
	    }
	});

	return FilterView;


});