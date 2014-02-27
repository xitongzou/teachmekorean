define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var VocabView = Backbone.View.extend({

        tagName: 'div',
        className: 'vocab-content col-sm-3 well well-small',
        template: '#vocab-template',

        initialize: function () {
            this.render();
        },

        render: function () {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template());
        }

    });

    return VocabView;
});