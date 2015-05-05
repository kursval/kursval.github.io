define([
  'jquery',
  'underscore',
  'backbone',
  'CoursePicker',
  'text!../templates/ProgramSelectorTemplate.html',
  'text!../templates/SpecialSelectorTemplate.html',
  'text!../templates/SearchFilterTemplate.html',
  'text!../templates/FilterInitTemplate.html',
  'text!../templates/StudyPeriodPickerTemplate.html',
  'jquery-ui',
  'bootstrap'
], function ( $, _, Backbone, CoursePicker, ProgramTemplate, SpecialTemplate, SearchTemplate, FilterInitTemplate, StudyPeriodPickerTemplate) {

	var FilterView = Backbone.View.extend({
	    el:             '#header',
	    
	    events: {
	        'keyup #text-filter .form-control': 'keyboardInput',
	        'change #program-selector': 		'changeProgram',
	        'change #special-selector': 		'changeSpecial',
	        'click #studyPeriodToggle label': 	'toggleSp'
	    },

	    initialize: function () {
	        
	    },

	    toggleSp: function (e) {
	    	var sp = $(e.currentTarget).attr('sp');
	        Backbone.trigger('toggleSp', sp);
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
	        this.$el.empty();
	    },

	    renderProgram: function() {
	    	var template = _.template(ProgramTemplate);
			this.$('.form-inline').append(template({
	            'programs' : CoursePicker.programList
	        }));
	    	
			if (CoursePicker.getActiveProgram())
	    		this.$('#program-selector').val(CoursePicker.getActiveProgram());

			return this;
	    },

	    renderSpecial: function() {
	    	this.$('#special-selector').empty();
	    	var specials = this.collection.getAllSpecials();
	    	var template = _.template(SpecialTemplate);
			this.$('.form-inline').append(template({
	            'specializations': specials,
	        }));
			if (CoursePicker.getActiveSpecial())
	    		this.$('#special-selector').val(CoursePicker.getActiveSpecial());

			return this;
	    },

	    renderSearch: function() {
	    	var template = _.template(SearchTemplate);
			this.$('#search').html(template({}));
			return this;
	    },

	    renderStudyPeriodToggler: function () {
	    	var template = _.template(StudyPeriodPickerTemplate);
			this.$('#studyPeriodToggle').html(template({
				spList: CoursePicker.activeStudyPeriods 
			}));
			return this;
	    },

	    render: function () {	    	
	    	this.$el.html(_.template(FilterInitTemplate)());
	    	//this.$('.form-inline').empty();
	        this.renderProgram();
	        this.renderSpecial();
	        this.renderSearch();
	        this.renderStudyPeriodToggler();
	        
	        return this;
	    }
	});

	return FilterView;


});