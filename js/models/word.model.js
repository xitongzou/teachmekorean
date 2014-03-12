define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var WordModel = Backbone.Model.extend({
        defaults: {
            "word": "",
            "translation": "",
            "expanded": "",
            "particle": false,
            "dataid": "",
            "title": "",
            "content": "",
            "forms": ""
        }
    });

    return WordModel;
});