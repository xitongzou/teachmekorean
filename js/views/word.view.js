define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var WordView = Backbone.View.extend({

        tagName: 'div',
        className: 'container-fluid',
        template: '#word-template',

        events: {
            "click button": "closePopover"
        },

        initialize: function (opts) {
            this.title = opts.title;
            this.render(opts.collection);
        },

        closePopover: function (evt) {
            $(evt.target).parents('.popover').prev('.popover-link').popover('hide')
        },

        render: function (collection) {
            var title = this.title;
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({
                title: title,
                entries: collection.toJSON()
            }));
        }

    });

    return WordView;
});