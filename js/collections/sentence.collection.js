define([
    'jquery',
    'underscore',
    'backbone',
    'sentence.model'
], function ($, _, Backbone, SentenceModel) {

    var SentenceCollection = Backbone.Collection.extend({
        model: SentenceModel
    });

    return SentenceCollection;
});