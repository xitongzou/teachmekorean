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

        initialize: function (opts) {
            this.title = opts.title;
            this.render(opts.collection);
        },

        render: function (collection) {
            var self = this;
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({
                title: self.title,
                entries: collection.toJSON()}));
        }

    });

    return ContentView;
});