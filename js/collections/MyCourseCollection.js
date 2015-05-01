define([
  'jquery',
  'underscore',
  'collections/CourseCollection',
  'models/CourseModel',
  'backbone',
  'backbone.localStorage'
], function ( $, _, CourseCollection, CourseModel, Backbone ) {

	var MyCourseCollection = CourseCollection.extend({
	    model: CourseModel,
	    
	    initialize: function (models, options) {
	        this.localStorage = new Backbone.LocalStorage(options.storageName);
	    },
	    
	    addCourse: function (course) {
	        this.create(course.toJSON());
	    },

	    getTotalCredits: function () {
	    	var sum = this.reduce(function(memo, course){ 
	    		return memo + course.getCredits();
	    	}, 0);
	    	return sum;
	    },

	    getTotalSpCredits: function (sp) {
	    	var courses = this.filter(function (course) {
	    		return _.contains(course.getSp(),sp);
	    	});
	    	var res = _.reduce(courses, function (memo, course) {
	    		var nbrPeriods = course.getSp().length;
	    		var avgCredits = course.getCredits() / nbrPeriods;
	    		return memo + avgCredits; 
	    	}, 0.0);
	    	return res;
	    }
	    
	});

	return MyCourseCollection;

});
