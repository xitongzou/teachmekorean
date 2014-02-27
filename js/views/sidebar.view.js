define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var SidebarView = Backbone.View.extend({

        tagName: 'nav',
        className: 'col-sm-3',
        template: '#sidebar-template',

        initialize: function () {
            this.render();
        },

        render: function () {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template());
        }

    });

    return SidebarView;
});