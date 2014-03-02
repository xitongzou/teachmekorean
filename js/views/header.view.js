define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var HeaderView = Backbone.View.extend({

        tagName: 'header',
        className: 'container-fluid',
        template: '#header-template',

        initialize: function () {
            this.render();
        },

        render: function () {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template());
            $('#header').html(this.$el);
        }

    });

    return HeaderView;
});