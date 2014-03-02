require.config({
    baseUrl: "js",
    paths: {
        "jquery": "jquery-2.1.0.min",
        "backbone": "backbone-1.1.2.min",
        "bootstrap": "bootstrap-3.1.1.min",
        "handlebars": "handlebars-1.3.0",
        "underscore": "lodash-2.4.1.min",
        "backbone.babysitter": "backbone.babysitter-0.1.0",
        "app.router": "router/app.router",
        "header.view": "views/header.view",
        "footer.view": "views/footer.view",
        "sidebar.view": "views/sidebar.view",
        "vocab.view": "views/vocab.view",
        "content.view": "views/content.view",
        "word.view": "views/word.view",
        "content.model": "models/content.model",
        "sentence.model": "models/sentence.model",
        "sentence.collection": "collections/sentence.collection",
        "content.collection": "collections/content.collection",
        "word.model": "models/word.model",
        "word.collection": "collections/word.collection"
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
        'backbone.babysitter': {
            deps: ['jquery','underscore', 'backbone'],
            exports: 'Backbone.ChildViewContainer'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});