define([
  'jquery',
  'underscore',
  'backbone', 
  'views/FilterView',
  'views/MyFilterView',
  'views/CourseListView',
  'views/MyCourseListView',
  'collections/CourseCollection',
  'controller/Controller',
  'json!../../programs/datateknik.json',
  'json!../../programs/kemiteknik.json',
  'json!../../programs/fysik.json',
  'json!../../programs/elektroteknik.json',

], function ( $, _, Backbone, FilterView, MyFilterView, CourseListView, MyCourseListView, CourseCollection, Controller, data, kemi, fysik, elektro) {
	
	var ApplicationRouter = Backbone.Router.extend({
	    
		initialize: function(options) {
	        this.listenTo(Backbone, 'filterSpec', this.specChange);
	        this.listenTo(Backbone, 'filterText', this.textChange);
	        this.listenTo(Backbone, 'filterProgram', this.programChange);
	        this.listenTo(Backbone, 'filterMyProgram', this.myProgramChange);
	        this.listenTo(Backbone, 'removeMyCourse', this.removeMyCourse);
			Backbone.history.start();
		},
	    
	    myProgramChange: function (program) {
	        Controller.myProgram = program;
	        this.myCourses();
	    },
	    
	    removeMyCourse: function (courseId, year) {
	        var activeProgram = _.findWhere(Controller.schedule, {'programId': Controller.myProgram});
	        if (year === 4) {
	            activeProgram.year4.get(courseId).destroy();
	        } else if (year === 5) {
	            activeProgram.year5.get(courseId).destroy();
	        }
	        this.myCourses();
	    },
	    
	    specChange: function(spec) {
	        this.filterParams.spec = spec;
	        this.renderIt();
	    },
	    
	    textChange: function(text) {
	        this.filterParams.text = text;   
	        this.renderIt();
	    },
	    
	    programChange: function (program) {
	        switch(program) {
	            case 'data':
	                Controller.programData = data;
	                break;
	            case 'elektro':
	                Controller.programData = elektro;
	                break;
	            case 'fysik':
	                Controller.programData = fysik;
	                break;
	            case 'kemi':
	                Controller.programData = kemi;
	                break;
	            default:
	                program = '';
	                break;
	        }
	        Controller.programName = program;
	        this.filterParams.spec = '';
	        this.filterParams.text = '';
	        this.init();
	    },
	    
	    filterParams: {
	        spec: '',
	        text: ''
	    },
	    
		routes: {
			''           : 'init',
	        'allCourses' : 'init',
	        'myCourses'  : 'myCourses',
		},
	    
	    renderIt: function () {
	        courseListView.render(this.filterParams.spec, this.filterParams.text);
	    },
	    
	    myCourses: function () {        
	        myFilterView = new MyFilterView({
	            'schedule' : Controller.schedule
	        });
	        myFilterView.render();

	        var myCourseListView = new MyCourseListView({ //räcker med en gång...
			    'schedule': Controller.schedule
			});	        
	        myCourseListView.render();
	    },

		init: function () {
	        courses = new CourseCollection(Controller.programData);
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