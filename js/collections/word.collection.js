define([
    'jquery',
    'underscore',
    'backbone',
    'word.model'
], function ($, _, Backbone, WordModel) {

    var WordCollection = Backbone.Collection.extend({
        model: WordModel
    });

    return WordCollection;
});