define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var FooterView = Backbone.View.extend({

        tagName: 'footer',
        className: 'container-fluid',
        template: '#footer-template',

        initialize: function () {
            this.render();
        },

        render: function () {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template());
        }

    });

    return FooterView;
});