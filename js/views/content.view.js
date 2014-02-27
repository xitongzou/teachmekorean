define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var ContentView = Backbone.View.extend({

        tagName: 'div',
        className: 'container-fluid',
        template: '#content-template',

        initialize: function (collection) {
            this.render(collection);
        },

        render: function (collection) {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({entries: collection.toJSON()}));
        }

    });

    return ContentView;
});