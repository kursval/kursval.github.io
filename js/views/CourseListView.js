define([
  'jquery',
  'underscore',
  'backbone',
  'views/CourseView'
], function ( $, _, Backbone, CourseView) {

	var CourseListView = Backbone.View.extend({
	    el: '#main-content',
	    
	    initialize: function () {
	        this.subViews = []
	    },

	    remove: function () {
	        _.each(this.subViews, function (v) {
	            v.remove();
				v.unbind();
	        });
	        
	        this.subViews = [];
	        this.undelegateEvents();
	    },

	    emptyView: function () {
	        this.$el.empty();
	    },
	    
	    render: function (activeSpec, activeText) {
	    	this.$el.empty();
	        var fragment = document.createDocumentFragment();
	        var self = this;
	        this.collection.customFilter(activeSpec, activeText).each(function (course) {
	            var courseView = new CourseView({
	                model: course, 
	                type: 'course'
	            });
	            self.subViews.push(courseView);
	            fragment.appendChild(courseView.render().el)
	        });
	        this.$el.append('<div class="container"></div>');
	        this.$('.container').html(fragment);
	        //this.$el.append('</div>');
	        return this;
	    }
	    
	});

	return CourseListView;

});