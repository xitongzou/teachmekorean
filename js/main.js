require([
    'jquery',
    'underscore',
    'backbone',
    'app.router',
    'vocab.view',
    'bootstrap',
    'backbone.babysitter'
], function ($, _, Backbone, AppRouter, VocabView) {
    /** init **/
    $(function () {
        App = {};
        App.VocabView = new VocabView();
        App.AppRouter = new AppRouter();
        Backbone.history.start();
    });
});