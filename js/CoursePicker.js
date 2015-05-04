// BUG: Inriktningar ändras inte

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

    	//bioteknik, ekosystemteknik, industriell ekonomi, infocom, lantmäteri, maskinteknik, maskinteknik - teknisk design, medicin och teknik, teknisk matematik, teknisk nanovetenskap, väg och vattenbyggnad, arkitekturutb, 

    	// The list of all json data to the courses in the active program
    	programData: null,

    	// Course chosen and to be added in year4 or year5
    	activeCourse: null,

    	// The text used to filter courses in the searchbar
    	filterParams: {
	        text: ''
	    },

	    setActiveFilterText: function (text) {
	    	this.filterParams.text = text;
	    },

	    getActiveFilterText: function () {
	    	return this.filterParams.text;
	    },

	    setActiveSpecial: function (special) {
	    	console.log(special);
	    	localStorage.setItem('activeSpecialName', special);
	    },

	    getActiveSpecial: function () {
	    	var res = localStorage.getItem('activeSpecialName');
	    	if (res) {
	    		return res;
	    	}
	    	else {
	    		return 'all';
	    	}
	    },

	    getActiveProgramFullName: function () {
	    	var name = this.getActiveProgram();
	    	if(name) {
	    		var tmp = _.filter(this.programList, {'id':name});
	    		name = tmp[0].name;
	    	} 
	    	return name;

	    },

    	getActiveProgram: function () {
    		return localStorage.getItem('activeProgramName');
    	},

    	setActiveProgram: function (program) {
    		localStorage.setItem('activeProgramName', program);
    	},

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

		    if (this.getActiveProgram()) {
		    	this.switchProgram(this.getActiveProgram());
		    }

	    }),

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
	            case 'none':
	            	this.programData = [];
	            default:
	                program = '';
	                break;
	        }
	        this.setActiveProgram(program);
    	},

    	removeMyCourse: function(courseId, year) {
    		var activeProgram = _.findWhere(this.schedule, {'programId': this.getActiveProgram()});
	        if (year === 4) {
	            activeProgram.year4.get(courseId).destroy();
	        } else if (year === 5) {
	            activeProgram.year5.get(courseId).destroy();
	        }
    	}


    };
    return CoursePicker; 

});