var Course = Backbone.Model.extend({
    
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
    }
    
});

var MyCourse = Course.extend({
    
});

var CourseCollection = Backbone.Collection.extend({
    model: Course,
    
    initialize: function () {
        
    },
    
    filterSpecial: function (list, activeSpec) {
        
        if (activeSpec === 'all') {
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
    
    
        
    
});

var MyCourseCollection = CourseCollection.extend({
    model: MyCourse,
    
    initialize: function (models, options) {
        this.localStorage = new Backbone.LocalStorage(options.storageName);
    },
    
    addCourse: function (course) {
        this.create(course.toJSON());
    },
    
});

var FilterView = Backbone.View.extend({
    el:             '#header',
    template:       '#header-template',
    
    events: {
        'keyup #text-filter .form-control':        'keyboardInput',
        'click ul#program-picker li a':   'changeProgram',
        'click ul#special-picker li a':   'changeSpecial',
    },
    
    initialize: function () {
        
    },
    
    keyboardInput: function (e) {
        var textInput = $(e.currentTarget).val();
        Backbone.trigger('filterText', textInput);
    },

    changeProgram: function (e) {
        var chosenProgram = $(e.currentTarget).text();
        var shortname = $(e.currentTarget).data('id');
        
        $('#pick-program-button').text(chosenProgram + ' ');
        $('#pick-program-button').append($('<span class="caret"></span>'));
        
        Backbone.trigger('filterProgram', shortname);
    },
    
    changeSpecial: function (e) {

        var chosenSpecial = $(e.currentTarget).text();
        var shortname = $(e.currentTarget).data('id');
        
        $('#pick-special-button').text(chosenSpecial + ' ');
        $('#pick-special-button').append($('<span class="caret"></span>'));
        
        Backbone.trigger('filterSpec', shortname);
    },
    
    emptyView: function () {
        this.$el.empty();
    },

    render: function () {
        var specials = this.collection.getAllSpecials();
        var html = $(this.template).html();
        var template = _.template(html);
        this.$el.html(template({
            'specializations': specials,
            'programs' : programList
        }));
        
        
        var p = _.findWhere(programList, { 'id': programName});
        if (p) {
            $('#pick-program-button').data(p.id);
            $('#pick-program-button').text(p.name + ' ');
            $('#pick-program-button').append($('<span class="caret"></span>'));        
        }
        
        return this;
    }
});

var MyFilterView = FilterView.extend({
    el:       '#header',
    template: '#my-header-template',
    
    events: {
        'click ul#my-program-picker li a': 'changeMyProgram',
    },
    
    initialize: function (args) {
        this.schedule = args.schedule;
    },
    
    changeMyProgram: function(e) {
        var chosenProgram = $(e.currentTarget).text();
        var shortname = $(e.currentTarget).data('id');
        
        $('#pick-my-program-button').text(chosenProgram + ' ');
        $('#pick--myprogram-button').append($('<span class="caret"></span>'));
        
        Backbone.trigger('filterMyProgram', shortname);
    },
    
    render: function () {
        
        this.$el.empty();
        var html = $(this.template).html()
        var template = _.template(html);
        this.$el.append(template({
            'schedule' : this.schedule
        }));
        
        var p = _.findWhere(programList, { 'id': myProgram});
        if (p) {
            $('#pick-my-program-button').data(p.id);
            $('#pick-my-program-button').text(p.name + ' ');
            $('#pick-my-program-button').append($('<span class="caret"></span>'));        
        }
        
    }
    
});

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
        var html = $(this.template).html();
        var template = _.template(html);
        this.$el.html(template({
            'c': this.model.toJSON(),
            'type' : this.type,
            'year' : this.year
        }));
        return this;
    },
    
});

var MyCourseListView = Backbone.View.extend({
    
    el: '#main-content',
    //template: '#my-header-template',
    
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
        var activeProgram = _.findWhere(this.schedule, {'programId': myProgram});
        
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


var ApplicationRouter = Backbone.Router.extend({
    
	initialize: function(options) {
                
        this.listenTo(Backbone, 'filterSpec', this.specChange);
        this.listenTo(Backbone, 'filterText', this.textChange);
        this.listenTo(Backbone, 'filterProgram', this.programChange);
        this.listenTo(Backbone, 'filterMyProgram', this.myProgramChange);
        this.listenTo(Backbone, 'removeMyCourse', this.removeMyCourse);
		Backbone.history.start();
	},
    
    myProgramChange: function (program) {
        myProgram = program;
        this.myCourses();
    },
    
    removeMyCourse: function (courseId, year) {
        var activeProgram = _.findWhere(schedule, {'programId': myProgram});
        if (year === 4) {
            activeProgram.year4.get(courseId).destroy();
        } else if (year === 5) {
            activeProgram.year5.get(courseId).destroy();
        }
        this.myCourses();
    },
    
    specChange: function(spec) {
        this.filterParams.spec = spec;
        this.renderIt();
    },
    
    textChange: function(text) {
        this.filterParams.text = text;   
        this.renderIt();
    },
    
    programChange: function (program) {
        switch(program) {
            case 'data':
                programData = data;
                break;
            case 'elektro':
                programData = elektro;
                break;
            case 'fysik':
                programData = fysik;
                break;
            case 'kemi':
                programData = kemi;
                break;
            default:
                program = '';
                break;
        }
        programName = program;
        this.filterParams.spec = '';
        this.filterParams.text = '';
        this.init();
    },
    
    filterParams: {
        spec: '',
        text: ''
    },
    
	routes: {
		''           : 'init',
        'allCourses' : 'init',
        'myCourses'  : 'myCourses',
	},
    
    renderIt: function () {
        courseListView.render(this.filterParams.spec, this.filterParams.text);
    },
    
    myCourses: function () {        
        myFilterView = new MyFilterView({
            'schedule' : schedule
        });
        myFilterView.render();
        myCourseListView.render();
    },

	init: function () {
        courses = new CourseCollection(programData);
        filterView = new FilterView({
            collection: courses,
        });
        courseListView = new CourseListView({
            collection: courses
        });
        
        filterView.render();
        courseListView.render(this.filterParams.spec, this.filterParams.text);
    },
        

});


var courses, filterView, courseListView, myCourseListView, myFilterView;

var myProgram;
var programData;
var programName;
var programList = [
    {'id' : 'data', 'name' : 'Datateknik'},
    {'id' : 'elektro', 'name' : 'Elektroteknik'},
    {'id' : 'kemi', 'name' : 'Kemiteknik'},
    {'id' : 'fysik', 'name' : 'Teknisk fysik'}
];
var schedule = _.map(programList, function (p) {
    var storageName4 = p.id + '-storage4';
    var storageName5 = p.id + '-storage5';
    
    return {
        'programId': p.id, 
        'programName': p.name, 
        'year4': new MyCourseCollection([], { 'storageName': storageName4 }), 
        'year5': new MyCourseCollection([], { 'storageName': storageName5 }),
    }
});

var myCourseListView = new MyCourseListView({ //räcker med en gång...
    'schedule': schedule
});



//###//###//###//###//###//###//###//###//###//###//###

var nbrCollLoaded = 0; 
var collectionLoaded = function () {
    nbrCollLoaded +=1;
    if(self.nbrCollLoaded == 8) {
        new ApplicationRouter;
    }
}
        
_.each(schedule, function (o) {
    o.year4.fetch({success: collectionLoaded});
    o.year5.fetch({success: collectionLoaded});
});

var activeCourse;
$('#select-modal').on('show.bs.modal', function (e) {
    activeCourseId = $(e.relatedTarget).data('course');
    activeCourse = courses.get(activeCourseId);
});

$('#year-4-button').on('click', function () {
    var activeProgram = _.findWhere(schedule, {'programId': programName});
    activeProgram.year4.addCourse(activeCourse);
});

$('#year-5-button').on('click', function () {
    var activeProgram = _.findWhere(schedule, {'programId': programName});
    activeProgram.year5.addCourse(activeCourse);
})