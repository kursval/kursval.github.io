define([
  'jquery',
  'underscore',
  'backbone', 
], function ( $, _, Backbone) {

	var CourseModel = Backbone.Model.extend({
	    
	    getName: function () {
	        return this.get('name');
	    },
	    
	    getCode: function () {
	        return this.get('code');
	    },
	    
	    getCredits: function () {
	        return this.get('credits');
	    },
	    
	    getCycle: function () {
	        return this.get('cycle');
	    },
	    
	    getSp: function () {
	        return this.get('sp');
	    },
	    
	    getSpecials: function () {
	        return this.get('specializations');
	    },
	    
	    getId: function () {
	        return this.get('id');
	    },

	    isOnHold: function () {
	    	return this.get('on_hold');
	    }
	    
	});

	return CourseModel;

});