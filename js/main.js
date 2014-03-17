require([
    'jquery',
    'underscore',
    'backbone',
    'app.router',
    'vocab.list.view',
    'bootstrap',
    'backbone.babysitter'
], function ($, _, Backbone, AppRouter, VocabListView) {
    /** init **/
    $(function () {
        App = {};
        App.VocabListView = new VocabListView();
        App.AppRouter = new AppRouter();
        Backbone.history.start();
    });
});