define([
  'jquery',
  'underscore',
  'backbone', 
  'collections/MyCourseCollection',
  'json!../../programs/datateknik.json',
  'json!../../programs/kemiteknik.json',
  'json!../../programs/fysik.json',
  'json!../../programs/elektroteknik.json',

], function ( $, _, Backbone, MyCourseCollection, data, kemi, fysik, elektro) {

    var CoursePicker = {

    	init: _.once(function() { 
			this.programList = [
		        {'id' : 'data', 'name' : 'Datateknik'},
		        {'id' : 'elektro', 'name' : 'Elektroteknik'},
		        {'id' : 'kemi', 'name' : 'Kemiteknik'},
		        {'id' : 'fysik', 'name' : 'Teknisk fysik'}
		    ];
		    
		    this.schedule = _.map(this.programList, function (p) {
		        var storageName4 = p.id + '-storage4';
		        var storageName5 = p.id + '-storage5';

		        return {
		            'programId': p.id, 
		            'programName': p.name, 
		            'year4': new MyCourseCollection([], { 'storageName': storageName4 }), 
		            'year5': new MyCourseCollection([], { 'storageName': storageName5 }),
		        }
		    });
	    }),

    	myProgram: null,
    	programData: null,
    	programName: null,
    	activeCourse: null,

    	switchProgram: function (program) {
    		switch(program) {
	            case 'data':
	                this.programData = data;
	                break;
	            case 'elektro':
	                this.programData = elektro;
	                break;
	            case 'fysik':
	                this.programData = fysik;
	                break;
	            case 'kemi':
	                this.programData = kemi;
	                break;
	            default:
	                program = '';
	                break;
	        }
	        this.programName = program;
    	},

    	changeMyProgram: function(program) {
    		this.myProgram = program;
    	},

    	removeMyCourse: function(courseId, year) {
    		var activeProgram = _.findWhere(this.schedule, {'programId': this.myProgram});
	        if (year === 4) {
	            this.activeProgram.year4.get(courseId).destroy();
	        } else if (year === 5) {
	            this.activeProgram.year5.get(courseId).destroy();
	        }
    	}


    };
    return CoursePicker; 

});