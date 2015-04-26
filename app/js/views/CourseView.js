define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/CourseTemplate.html',
], function ( $, _, Backbone, Template) {

	var CourseView = Backbone.View.extend({
	    template: '#course-template',
	    
	    events: {
	        'click #remove-course' : 'removeCourse'
	    },
	    
	    initialize: function(args) {
	        this.type = args.type;
	        this.year = args.year;
	    },
	    
	    removeCourse: function (e) {
	        var courseId = $(e.currentTarget).data('id');
	        var year = $(e.currentTarget).data('year');
	        Backbone.trigger('removeMyCourse', courseId, year);
	    },
	    
	    render: function () {
	        var template = _.template(Template);
	        this.$el.html(template({
	            'c': this.model.toJSON(),
	            'type' : this.type,
	            'year' : this.year
	        }));
	        return this;
	    },
	    
	});

	return CourseView;

});