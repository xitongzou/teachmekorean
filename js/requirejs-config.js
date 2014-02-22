require.config({
    baseUrl: "/Users/Tong/Documents/GitHub/teachmekorean/js",
    paths: {
        "jquery": "jquery-2.1.0.min",
        "backbone": "backbone-1.1.2.min",
        "bootstrap": "bootstrap-3.1.1.min",
        "handlebars": "handlebars-1.3.0",
        "underscore": "lodash-2.4.1.min"
    },
    shim: {
        handlebars: {
            exports: 'Handlebars'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    },
    waitSeconds: 15
});