define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var ContentModel = Backbone.Model.extend({
        defaults: {
            "title": "",
            "details": ""
        }
    });

    return ContentModel;
});