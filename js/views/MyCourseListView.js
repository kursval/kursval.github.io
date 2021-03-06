define([
  'jquery',
  'underscore',
  'backbone',
  'collections/CourseCollection',
  'views/CourseView',
  'CoursePicker',
  'text!../templates/StudyYearHeaderTemplate.html',
  'text!../templates/SpecialViewTemplate.html',
  'text!../templates/FullVeiwTemplate.html'
], function ( $, _, Backbone, CourseCollection, CourseView, CoursePicker, Template, SpecialViewTemplate, FullViewTemplate) {

	var MyCourseListView = Backbone.View.extend({
	    el: '#main-content',
	    
	    initialize: function (args) {
	        this.schedule = args.schedule;
	        this.subViews = [];
	    },
	    
	    remove: function () {
	        _.each(this.subViews, function (v) {
	            v.remove();
	        });
	        
	        this.subViews = [];
	        this.remove();
	    },
	    
	    renderYear: function(year) {
	        var activeProgram = _.findWhere(this.schedule, {'programId': CoursePicker.getActiveProgram()});

	        if(!activeProgram)
	            return this;
	        var fragment = document.createDocumentFragment();
	        var self = this;
	        var activeYear;

	        if (year === 4) {
	            activeYear = activeProgram.year4;
	        } else {
	            activeYear = activeProgram.year5;
	        }

	        var sortedCourses = activeYear.sortBy(function (c) {
	        	return c.getSp()[0];
	        });

	        new CourseCollection(sortedCourses).each(function (course) {
	            var courseView = new CourseView({
	                model: course,
	                type: 'myCourse',
	                year: year
	            });
	            self.subViews.push(courseView);
	            fragment.appendChild(courseView.render().el);
	        });
	        return $(fragment).clone(true);
	    },

	    renderHeader: function (year) {
	    	var activeYear;
			var activeProgram = _.findWhere(this.schedule, {'programId': CoursePicker.getActiveProgram()});
			var credits = 0; 
			var advanceCredits = 0;
			var studyPeriodsNbr = [1,2,3,4];
			var studyPeriodsCredits = [0,0,0,0];

			if (activeProgram) {
				if (year === 4) {
		            activeYear = activeProgram.year4;
		        } else {
		            activeYear = activeProgram.year5;
		        }
	        	credits = activeYear.getTotalCredits();
	        	studyPeriodsCredits = _.map(studyPeriodsNbr, function (nbr) {
	        		return activeYear.getTotalSpCredits(nbr);
	        	});
	        	advanceCredits = activeYear.getTotalAdvanceCredits();

			}
	    	var template = _.template(Template);
			this.$el.append(template({
				'studyYear': year,
				'totalCredits': credits,
				'studyPeriodsCredits': studyPeriodsCredits,
				'advanceCredits': advanceCredits
			}));
			return this;
	    },

	    renderSpecialView: function () {
	        var activeProgram = _.findWhere(this.schedule, {'programId': CoursePicker.getActiveProgram()});
	        var specials = [];
	        if(activeProgram) {
	        	var collection = new CourseCollection();
	        	activeProgram.year4.each(function (c) {
	        		collection.add(c);
	        	});
	        	activeProgram.year5.each(function (c) {
	        		collection.add(c);
	        	});
	        	specials = collection.getSpecialsAndCredits();
	        	
		    	var template = _.template(SpecialViewTemplate);
		    	this.$el.append('<div class="container" id="special-view"></div>');
		    	this.$('#special-view').append(template({
					'specials': specials
				}));
                var full = collection.getFullCredits();
                template = _.template(FullViewTemplate);
                this.$el.append('<div class="container" id="full-view"></div>');
		    	this.$('#full-view').append(template({
					'full': full
				}));
	        }
			return this;
	    },
	        
	        
	    render: function() {
	    	if(!CoursePicker.getActiveProgram()) {
	    		this.$el.append('<div class="container"><h2 style="text-align: center;">Inget program valt!</h2><hr/></div>');
	    		this.$el.append('<div class="container"><p style="text-align: center;">Gå tillbaka till kursvyn och välj ett program</p></div>');
	    		return this;
	    	}
	        this.$el.empty();
	        this.$el.append('<br></br>');
        
        	this.$el.append('<div class="container"><h1 style="text-align: center;">' + CoursePicker.getActiveProgramFullName() + '</h1><hr/></div>');

	        this.renderHeader(4);
	        this.$el.append('<div class="container" id="year4"></div>');
	        this.$('#header-year-4').append(this.renderYear(4));
	        this.renderHeader(5);
	        this.$el.append('<div class="container" id="year5"></div>');
	        this.$('#header-year-5').append(this.renderYear(5));

	        this.renderSpecialView();


	        return this;
	    },
	    
	});


	return MyCourseListView;


});
