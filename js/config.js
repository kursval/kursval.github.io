require.config({
    baseUrl: 'js/',
    // load the main file
    deps: ['main'],

    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {

        "bootstrap" : { 
            deps :['jquery-ui', 'jquery'] 
        },
        'underscore': {
            exports: '_'
        },
        'jquery-ui': {
            export: '$',
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },

    paths: {
        'jquery': 'lib/jquery',
        'jquery-ui': 'lib/jquery-ui.min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min',
        'backbone.localStorage': 'lib/backbone.localStorage-min',
        'text': 'lib/text',
        'json': 'lib/json',
        'bootstrap' :  'lib/bootstrap.min'
    }
});