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
			''           						: 'allCourses',
	        ':program/:special'					: 'allCourses',
	        ':program'							: 'allCourses',
	        'allCourses/:program'				: 'allCourses',
	        'allCourses' 						: 'allCourses',
	        'myCourses/:program'				: 'myCourses',
	        'myCourses'  						: 'myCourses'
		},

		initialize: function(options) {
	        this.listenTo(Backbone, 'filterSpec', this.specChange);
	        this.listenTo(Backbone, 'filterText', this.textChange);
	        this.listenTo(Backbone, 'filterProgram', this.programChange);
	        this.listenTo(Backbone, 'filterMyProgram', this.myProgramChange);
	        this.listenTo(Backbone, 'removeMyCourse', this.removeMyCourse);
			Backbone.history.start();
		},
	    
	    filterParams: {
	        spec: 'all',
	        text: ''
	    },
	    
	    removeMyCourse: function (courseId, year) {
	        CoursePicker.removeMyCourse(courseId, year);
	        this.myCourses();
	    },
	    
	    specChange: function(spec) {
	        this.filterParams.spec = spec;
	        this.renderFilteredCollection();
	    },
	    
	    textChange: function(text) {
	        this.filterParams.text = text;   
	        this.renderFilteredCollection();
	    },
	    
	    programChange: function (program) {
	        CoursePicker.switchProgram(program);
	        this.filterParams.spec = 'all';
	        this.filterParams.text = '';

	        this.allCourses();
	    },
	    	    
	    renderFilteredCollection: function () {
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	    
	    myCourses: function (program) {

	    	if(program)
				CoursePicker.switchProgram(program);

	    	if(!(typeof myCourseListView === 'undefined' || myCourseListView === null)) {
	        	myCourseListView.remove(); // should have another name...
	        }

	        if(!(typeof filterView === 'undefined' || filterView === null)) {
	        	filterView.emptyView();
	        }

	        var myCourseListView = new MyCourseListView({ //räcker med en gång...
			    'schedule': CoursePicker.schedule
			});	        
	        myCourseListView.render();
	    },

		allCourses: function (program) {

			if(program)
				CoursePicker.switchProgram(program);

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
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	        

	});

	return ApplicationRouter;

});