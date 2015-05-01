define([
  'jquery',
  'underscore',
  'backbone',
  'models/CourseModel'
], function ( $, _, Backbone, CourseModel) {

	var CourseCollection = Backbone.Collection.extend({
	    model: CourseModel,
	    
	    initialize: function () {
	        
	    },
	    
	    filterSpecial: function (list, activeSpec) {
	        if (activeSpec === 'all' || activeSpec === '' || !activeSpec) {
	            return list;   
	        }
	        
	        var res = [];
	        res = _.filter(list, function (c) {
	            var specials = c.getSpecials();
	                specials = _.map(specials, function (s) {
	                    return s.shortname;
	                });
	                return _.find(specials, function (s) {
	                    return s === activeSpec;
	                });
	        });
	        return res;
	    },
	    
	    filterOnText: function (list, activeText) {
	        var res = [];
	        
	        var escaper = function escapeRegExp(str) {
	            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	        }
	        var escapedText = escaper(activeText);
	        
	        var regex = new RegExp('' + escapedText + '', 'i');
	        res = _.filter(list, function (c) {
	            return (c.getCode().match(regex) != null) || (c.getName().match(regex) != null);
	        });
	        return res;
	    },
	    
	    customFilter: function (activeSpec, activeText) {
	        if (!activeText) {
	            activeText = '';   
	        }
	        if (!activeSpec) {
	        	activeSpec = 'all';
	        }
	        if (activeSpec === '') {
	        	activeSpec = 'all';
	        }
	        var list = this.map(function (c) { return c; });
	        list = this.filterSpecial(list, activeSpec);
	        list = this.filterOnText(list, activeText);
	        return new CourseCollection(list);
	    },
	    
	    getAllSpecials: function () {
	        var specials = [];
	        this.each(function (c) {
	            var currSpecials = c.getSpecials();
	            _.each(currSpecials, function (s) {
	                specials.push(s); 
	            });
	        });
	        
	        var iteratee = function (a) {
	            return a.shortname;
	        }
	        
	        return _.uniq(specials, iteratee);
	    },

		getSpecialsAndCredits: function () {
	    	var specials = this.pluck("specializations");
	    	specials = _.flatten(specials);
	    	specials = _.uniq(specials, function(course) {
	    		return course.shortname;
	    	});

	    	var self = this;
	    	var res = _.map(specials, function (s) {
	    		var credits = self.reduce(function(memo, course) {
	    			var courseSpecials = course.getSpecials();
	    			var shortCourseSpecials = _.pluck(courseSpecials, "shortname");
	    			var sameSpecial = _.contains(shortCourseSpecials, s.shortname);

	    			if (sameSpecial) {
	    				return memo + course.getCredits();
	    			}
	    			else {
	    				return memo + 0;
	    			}

	    		}, 0);

	    		var percent = 100 * (1.0 + credits) / 30.0;
	    		if (percent > 100)
	    			percent = 100;

	    		return {
	    			'credits': credits,
	    			'special': s.fullname,
	    			'percent': parseInt(percent, 10)
	    		};
	    	});
	    	return res;
	    	
	    }
	});

	return CourseCollection;


});