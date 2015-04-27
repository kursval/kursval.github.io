require([
  'backbone',
  'routes/ApplicationRouter',
  'views/MyCourseListView',
  'CoursePicker',
], function (Backbone, ApplicationRouter, MyCourseListView, CoursePicker) {

    CoursePicker.init();

    var nbrCollLoaded = 0; 
    var collectionLoaded = function () {
        nbrCollLoaded +=1;
        if(nbrCollLoaded == 8) {
            new ApplicationRouter;
        }
    }
            
    _.each(CoursePicker.schedule, function (o) {
        o.year4.fetch({success: collectionLoaded});
        o.year5.fetch({success: collectionLoaded});
    });

    $('#select-modal').on('show.bs.modal', function (e) {
        activeCourseId = $(e.relatedTarget).data('course');
        CoursePicker.activeCourse = courses.get(activeCourseId);
    });

    $('#year-4-button').on('click', function () {
        var activeProgram = _.findWhere(CoursePicker.schedule, {'programId': CoursePicker.programName});
        activeProgram.year4.addCourse(CoursePicker.activeCourse);
    });

    $('#year-5-button').on('click', function () {
        var activeProgram = _.findWhere(CoursePicker.schedule, {'programId': CoursePicker.programName});
        activeProgram.year5.addCourse(CoursePicker.activeCourse);
    });  

	var myCourseListView = new MyCourseListView({
	    'schedule': CoursePicker.schedule
	});

});