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
            "click button": "closePopover",
            "click a": "addToVocabList"
        },

        initialize: function (opts) {
            this.title = opts.title;
            this.render(opts.collection);
        },

        closePopover: function (evt) {
            $(evt.target).parents('.popover').prev('.popover-link').popover('hide')
        },

        escape: function (string) {
            return String(string).replace(/[&<>",;'\s\/]/g, "");
        },

        addToVocabList: function (evt) {
            var target = $(evt.target);
            if (target.parents('.popover').length > 0) {
                var wordId = target.parents('.popover').prev('.popover-link').attr('data-id');
                //wordId = this.escape(wordId);
                App.VocabListView.addToVocabList(wordId);
                console.log(wordId);
            }
        },

        render: function (collection) {
            var self = this;
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({
                title: self.title,
                entries: collection.toJSON()
            }));
            $('#word-holder').html(this.$el);
        }

    });

    return WordView;
});