define([
  'jquery',
  'underscore',
  'backbone',
  'views/CourseView',
  'CoursePicker'
], function ( $, _, Backbone, CourseView, CoursePicker) {

	var MyCourseListView = Backbone.View.extend({
	    el: '.main-content',
	    
	    year4Title: '<div class="page-header"><h2>Läsår 4</h2></div>',
	    year5Title: '<div class="page-header"><h2>Läsår 5</h2></div>',
	    
	    initialize: function (args) {
	        this.schedule = args.schedule;
	        this.subViews = [];
	    },
	    
	    remove: function () {
	        _.each(this.subViews, function (v) {
	            v.remove();
	        });
	        
	        this.subViews = [];
	        this.remove();
	    },
	    
	    renderYear: function(year) {

	        var activeProgram = _.findWhere(this.schedule, {'programId': CoursePicker.myProgram});
	        
	        if(!activeProgram)
	            return this;
	        var fragment = document.createDocumentFragment();
	        var self = this;
	        var activeYear;
	        if (year === 4) {
	            activeYear = activeProgram.year4;
	        } else {
	            activeYear = activeProgram.year5;
	        }

	        activeYear.each(function (course) {
	            var courseView = new CourseView({
	                model: course,
	                type: 'myCourse',
	                year: year
	            });
	            self.subViews.push(courseView);
	            fragment.appendChild(courseView.render().el);
	        });
	        this.$el.append(fragment);
	        return this;
	    },
	        
	        
	    render: function() {
	        this.$el.empty();
	        this.$el.append(this.year4Title);
	        this.$el.append(this.renderYear(4));
	        this.$el.append(this.year5Title);
	        this.$el.append(this.renderYear(5));
	        return this;
	    },
	    
	});


	return MyCourseListView;


});