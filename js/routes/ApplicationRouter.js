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
	        spec: '',
	        text: ''
	    },
	    
	    myProgramChange: function (program) {
	        CoursePicker.changeMyProgram(program);
	        this.myCourses();
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
	        this.filterParams.spec = '';
	        this.filterParams.text = '';
	        this.init();
	    },
	    	    
	    renderFilteredCollection: function () {
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	    
	    myCourses: function () {        
	        myFilterView = new MyFilterView({
	            'schedule' : CoursePicker.schedule
	        });
	        myFilterView.render();

	        var myCourseListView = new MyCourseListView({ //räcker med en gång...
			    'schedule': CoursePicker.schedule
			});	        
	        myCourseListView.render();
	    },

		allCourses: function () {
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