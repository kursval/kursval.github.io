// BUG: Inriktningar ändras inte

define([
  'jquery',
  'underscore',
  'backbone', 
  'collections/MyCourseCollection',
  //'json!../../programs/datateknik.json',
  //'json!../../programs/kemiteknik.json',
  //'json!../../programs/fysik.json',
  //'json!../../programs/elektroteknik.json',//data, kemi, fysik, elektro
  'json!../../programs/a.json',
  'json!../../programs/b.json',
  'json!../../programs/d.json',
  'json!../../programs/w.json',
  'json!../../programs/e.json',
  'json!../../programs/i.json',
  'json!../../programs/c.json',
  'json!../../programs/k.json',
  'json!../../programs/l.json',
  'json!../../programs/m.json',
  'json!../../programs/md.json',
  'json!../../programs/bme.json',
  'json!../../programs/f.json',
  'json!../../programs/pi.json',
  'json!../../programs/n.json',
  'json!../../programs/v.json',

], function ( $, _, Backbone, MyCourseCollection, a,b,d,w,e,i,c,k,l,m,md,bme,f,pi,n,v) {

    var CoursePicker = {

    	// The list of all json data to the courses in the active program
    	programData: null,

    	// Course chosen and to be added in year4 or year5
    	activeCourse: null,

    	// The text used to filter courses in the searchbar
    	filterParams: {
	        text: ''
	    },

	    activeStudyPeriods: {
	    	1 : true,
	    	2 : true,
	    	3 : true,
	    	4 : true
	    },

	    toggleStudyPeriod: function (sp) {
	    	this.activeStudyPeriods[sp] = !this.activeStudyPeriods[sp];
	    },

	    setActiveFilterText: function (text) {
	    	this.filterParams.text = text;
	    },

	    getActiveFilterText: function () {
	    	return this.filterParams.text;
	    },

	    setActiveSpecial: function (special) {
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
			/*this.programList = [
		        {'id' : 'data', 'name' : 'Datateknik'},
		        {'id' : 'elektro', 'name' : 'Elektroteknik'},
		        {'id' : 'kemi', 'name' : 'Kemiteknik'},
		        {'id' : 'fysik', 'name' : 'Teknisk fysik'}
		    ];*/

		    this.programList = [
			    { 'id' : 'a',    'name': 'Arkitektur'},
			    { 'id' : 'b',    'name': 'Bioteknik'},
			    { 'id' : 'd',    'name': 'Datateknik'},
			    { 'id' : 'w',    'name': 'Ekosystemteknik'},
			    { 'id' : 'e',    'name': 'Elektroteknik'},
			    { 'id' : 'i',    'name': 'Industriell ekonomi'},
			    { 'id' : 'c',    'name': 'Infocom'},
			    { 'id' : 'k',    'name': 'Kemiteknik'},
			    { 'id' : 'l',    'name': 'Lantmäteri'},
			    { 'id' : 'm',    'name': 'Maskinteknik'},
			    { 'id' : 'md',   'name': 'Maskinteknik - Teknisk design'},
			    { 'id' : 'bme',  'name': 'Medicin och teknik'},
			    { 'id' : 'f',    'name': 'Teknisk fysik'},
			    { 'id' : 'pi',   'name': 'Teknisk matematik'},
			    { 'id' : 'n',    'name': 'Teknisk nanovetenskap'},
			    { 'id' : 'v',    'name': 'Väg och vattenbyggnad'},
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
	        /*    case 'data':
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
*/
	            case 'a':
	            	this.programData = a;
	            	break;
	            case 'b':
	            	this.programData = b;
	            	break;
	            case 'd':
	            	this.programData = d;
	            	break;
	            case 'w':
	            	this.programData = w;
	            	break;
	            case 'e':
	            	this.programData = e;
	            	break;
	            case 'i':
	            	this.programData = i;
	            	break;
	            case 'c':
	            	this.programData = c;
	            	break;
	            case 'k':
	            	this.programData = k;
	            	break;
	            case 'l':
	            	this.programData = l;
	            	break;
	            case 'm':
	            	this.programData = m;
	            	break;
	            case 'md':
	            	this.programData = md;
	            	break;
	            case 'bme':
	            	this.programData = bme;
	            	break;
	            case 'f':
	            	this.programData = f;
	            	break;	
	            case 'pi':
	            	this.programData = pi;
	            	break;
	            case 'n':
	            	this.programData = n;
	            	break;
	            case 'v':
	            	this.programData = v;
	            	break;
	            case 'none':
	            	this.programData = [];
	            default:
	            	this.programData = [];
	                program = '';
	                break;

	        }
	        this.setActiveProgram(program);
    	},

    	removeMyCourse: function(courseId, year) {
    		var activeProgram = _.findWhere(this.schedule, {'programId': this.getActiveProgram()});
	        if (year === 4) {
	            activeProgram.year4.removeCourseWithId(courseId);
	        } else if (year === 5) {
	            activeProgram.year5.removeCourseWithId(courseId);
	        }
    	}


    };
    return CoursePicker; 

});