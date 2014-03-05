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
            "dataid": "",
            "title": "",
            "content": "",
            "forms": ""
        }
    });

    return WordModel;
});