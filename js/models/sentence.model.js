define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var SentenceModel = Backbone.Model.extend({
        defaults: {
            "translation": "",
            "words": []
        }
    });

    return SentenceModel;
});