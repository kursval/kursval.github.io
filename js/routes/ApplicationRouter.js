define([
  'jquery',
  'underscore',
  'backbone', 
  'views/FilterView',
  'views/MyFilterView',
  'views/CourseListView',
  'views/MyCourseListView',
  'collections/CourseCollection',
  'CoursePicker'

], function ( $, _, Backbone, FilterView, MyFilterView, CourseListView, MyCourseListView, CourseCollection, CoursePicker) {
	
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
			Backbone.history.start();
		},
	    
	    filterParams: {
	        spec: 'all',
	        text: ''
	    },
	    
	    /*myProgramChange: function (program) {
	    	// console.log('____ 4');
	        CoursePicker.changeMyProgram(program);
	        this.myCourses();
	    },*/
	    
	    removeMyCourse: function (courseId, year) {
	    	// console.log('____ 5');
	        CoursePicker.removeMyCourse(courseId, year);
	        this.myCourses();
	    },
	    
	    specChange: function(spec) {
	        this.filterParams.spec = spec;
	        this.renderFilteredCollection();
	        // console.log('____ 1');
	    },
	    
	    textChange: function(text) {
	        this.filterParams.text = text;   
	        this.renderFilteredCollection();
	        // console.log('____ 2');
	    },
	    
	    programChange: function (program) {
	    	// console.log('____ 3');
	        CoursePicker.switchProgram(program);
	        this.filterParams.spec = 'all';
	        this.filterParams.text = '';

	        this.allCourses();
	    },
	    	    
	    renderFilteredCollection: function () {
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	    
	    myCourses: function () {

	    	if(!(typeof myCourseListView === 'undefined' || myCourseListView === null)) {
	        	myCourseListView.remove(); // should have another name...
	        }

	        if(!(typeof filterView === 'undefined' || filterView === null)) {
	        	console.log('empty filterview');
	        	filterView.emptyView();
	        }

			/*
	        myFilterView = new MyFilterView({
	            'schedule' : CoursePicker.schedule
	        });
	        myFilterView.render();*/

	        var myCourseListView = new MyCourseListView({ //räcker med en gång...
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
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	        

	});

	return ApplicationRouter;

});