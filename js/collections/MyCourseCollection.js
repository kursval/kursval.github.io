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
	    
	    addCourse: function (course, year, existInOtherCollection) {
	    	var name = course.getCode();
	    	if (this.get(course.id)) {
	        	Backbone.trigger("collectionAddMsg", "info", name + " existerar redan i årskurs " + year + "!");
	    	} else {
	        	this.create(course.toJSON());
	        	if(existInOtherCollection) {
	    			Backbone.trigger("collectionAddMsg", "warning", name + " tillagd till årskurs! Observera att kurs redan finns i en annan årskurs");
	    		} else {
	        		Backbone.trigger("collectionAddMsg", "success", name + " tillagd till årskurs " + year + "!");
	    		}
	    	}
	    },

	    removeCourseWithId: function (courseId) {
	    	var courseCode = this.get(courseId).getCode();
	    	this.get(courseId).destroy();
	    	Backbone.trigger("collectionAddMsg", "danger", courseCode + " borttagen från schema");
	    },

	    exist: function(course) {
	    	return !(this.get(course.id) === undefined);
	    },

	    getTotalCredits: function () {
	    	var sum = this.reduce(function(memo, course){ 
	    		return memo + course.getCredits();
	    	}, 0);
	    	return sum;
	    },

	    getTotalAdvanceCredits: function () {
	    	var courses = this.where({'cycle': 'A'});
	    	var sum = courses.reduce(function(memo, course){ 
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

	    	// Either no precision or 2digit precision. 0 should be 0, not 0.00
	    	var tmp = res.toFixed();
	    	if(tmp == res)
	    		return tmp;
	    	else
	    		return res.toFixed(2);
	    },
	    
	});

	return MyCourseCollection;

});
