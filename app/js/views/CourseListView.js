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
	        });
	        
	        this.subViews = [];
	        this.remove();
	    },
	    
	    filterOnSpecial: function () {
	        var filteredList = this.collection.filter(function (c) {
	            var specials = c.getSpecials();
	            specials = _.map(specials, function (s) {
	                return s.shortname;
	            });
	            return _.find(specials, function (s) {
	                return s == 'ssr';
	            });
	        });
	        return new CourseCollection(filteredList);  
	    },
	    
	    render: function (activeSpec, activeText) {
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
	        this.$el.html(fragment);
	        return this;
	    }
	    
	});

	return CourseListView;

});