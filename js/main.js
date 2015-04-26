require([
  'backbone',
  'routes/ApplicationRouter',
  'views/MyCourseListView',
  'collections/MyCourseCollection',
  'controller/Controller',
], function (Backbone, ApplicationRouter, MyCourseListView, MyCourseCollection, Controller) {

    Controller.programList = [
        {'id' : 'data', 'name' : 'Datateknik'},
        {'id' : 'elektro', 'name' : 'Elektroteknik'},
        {'id' : 'kemi', 'name' : 'Kemiteknik'},
        {'id' : 'fysik', 'name' : 'Teknisk fysik'}
    ];
    Controller.schedule = _.map(Controller.programList, function (p) {
        var storageName4 = p.id + '-storage4';
        var storageName5 = p.id + '-storage5';
        
        return {
            'programId': p.id, 
            'programName': p.name, 
            'year4': new MyCourseCollection([], { 'storageName': storageName4 }), 
            'year5': new MyCourseCollection([], { 'storageName': storageName5 }),
        }
    });

    var nbrCollLoaded = 0; 
    var collectionLoaded = function () {
        nbrCollLoaded +=1;
        if(nbrCollLoaded == 8) {
            new ApplicationRouter;
        }
    }
            
    _.each(Controller.schedule, function (o) {
        o.year4.fetch({success: collectionLoaded});
        o.year5.fetch({success: collectionLoaded});
    });

    
    $('#select-modal').on('show.bs.modal', function (e) {
        activeCourseId = $(e.relatedTarget).data('course');
        Controller.activeCourse = courses.get(activeCourseId);
    });

    $('#year-4-button').on('click', function () {
        var activeProgram = _.findWhere(Controller.schedule, {'programId': Controller.programName});
        activeProgram.year4.addCourse(Controller.activeCourse);
    });

    $('#year-5-button').on('click', function () {
        var activeProgram = _.findWhere(Controller.schedule, {'programId': Controller.programName});
        activeProgram.year5.addCourse(Controller.activeCourse);
    });  


	var myCourseListView = new MyCourseListView({
	    'schedule': Controller.schedule
	});

});