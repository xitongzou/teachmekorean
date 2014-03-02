require([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'app.router',
    'vocab.view',
    'bootstrap',
    'backbone.babysitter'
], function ($, _, Backbone, Handlebars, AppRouter, VocabView) {
    /** init **/
    $(function () {
        App = {};
        App.VocabView = new VocabView();
        App.AppRouter = new AppRouter();
        Backbone.history.start();
    });
});