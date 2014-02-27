define([
    'jquery',
    'underscore',
    'backbone',
    'content.model'
], function ($, _, Backbone, ContentModel) {

    var ContentCollection = Backbone.Collection.extend({
        model: ContentModel
    });

    return ContentCollection;
});