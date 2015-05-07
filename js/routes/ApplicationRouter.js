define([
  'jquery',
  'underscore',
  'backbone', 
  'views/FilterView',
  'views/CourseListView',
  'views/MyCourseListView',
  'collections/CourseCollection',
  'CoursePicker'

], function ( $, _, Backbone, FilterView, CourseListView, MyCourseListView, CourseCollection, CoursePicker) {
	
	var ApplicationRouter = Backbone.Router.extend({
	    
		routes: {
			''           : 'allCourses',
	        'allCourses' : 'allCourses',
	        'myCourses'  : 'myCourses',
		},

		initialize: function(options) {
	        this.listenTo(Backbone, 'filterSpec', this.specChange);
	        this.listenTo(Backbone, 'filterText', this.textChange);
	        this.listenTo(Backbone, 'filterProgram', this.programChange);
	        this.listenTo(Backbone, 'filterMyProgram', this.myProgramChange);
	        this.listenTo(Backbone, 'removeMyCourse', this.removeMyCourse);
	        this.listenTo(Backbone, 'collectionAddMsg', this.makeNotification);
	        this.listenTo(Backbone, 'toggleSp', this.toggleSp);
	        //("info", "Hej på dig!");
			Backbone.history.start();
		},
	    
		toggleSp: function(sp) {
			CoursePicker.toggleStudyPeriod(sp);
			this.renderFilteredCollection();
		},

	    removeMyCourse: function (courseId, year) {
	        CoursePicker.removeMyCourse(courseId, year);
	        this.myCourses();
	    },
	    
	    specChange: function(spec) {
	        CoursePicker.setActiveSpecial(spec);
	        this.renderFilteredCollection();
	    },

	    // alertType is either success,warning,info or danger
	    makeNotification: function(alertType, text) {
	    	var divId = "#alert-box-" + alertType;
	    	$(divId).text(text);
	        $(divId).fadeIn();
	        window.setTimeout(function () {
				$(divId).fadeOut(300)
			}, 2000);
	    },
	    
	    textChange: function(text) {
	        CoursePicker.setActiveFilterText(text);
	        this.renderFilteredCollection();
	    },
	    
	    programChange: function (program) {

			var divId = "#main-content";
	        $(divId).html('<div id="spinner" class="spinner" style="position: fixed; margin-left:50%;">Laddar kurser...</div>');

	        setTimeout(function(self){
		        CoursePicker.switchProgram(program);
		        CoursePicker.setActiveSpecial('all');
		        CoursePicker.setActiveFilterText('');
		        self.allCourses();
			}, 150, this);


	    },
	    	    
	    renderFilteredCollection: function () {
	        courseListView.render(CoursePicker.getActiveSpecial(), CoursePicker.getActiveFilterText(), CoursePicker.activeStudyPeriods);
	    },
	    
	    myCourses: function () {

	    	if(!(typeof myCourseListView === 'undefined' || myCourseListView === null)) {
	        	myCourseListView.remove(); // should have another name...
	        }

	        if(!(typeof filterView === 'undefined' || filterView === null)) {
	        	filterView.emptyView();
	        }

	        var myCourseListView = new MyCourseListView({
			    'schedule': CoursePicker.schedule
			});	        
	        myCourseListView.render();
	    },

		allCourses: function () {

			if(!(typeof courseListView === 'undefined' || courseListView === null)) {
	        	courseListView.remove(); // should have another name...
	        }

	        if(!(typeof filterView === 'undefined' || filterView === null)) {
	        	filterView.undelegateEvents();
	        }

	        courses = new CourseCollection(CoursePicker.programData);
	        filterView = new FilterView({
	            collection: courses,
	        });

	        courseListView = new CourseListView({
	            collection: courses
	        });
	        filterView.render();
	        courseListView.render(CoursePicker.getActiveSpecial(), CoursePicker.getActiveFilterText());
	    },
	        

	});

	return ApplicationRouter;

});