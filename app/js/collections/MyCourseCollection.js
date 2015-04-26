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
	    
	});

	return MyCourseCollection;

});
