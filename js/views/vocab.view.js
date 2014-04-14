define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars'
], function ($, _, Backbone, Handlebars) {

    var VocabView = Backbone.View.extend({

        tagName: 'div',
        className: 'vocab-content vocab-view',
        template: '#vocab-template',
        words: null,

        events: {
            "click a": "addToVocabList"
        },

        initialize: function (opts) {
            this.title = opts.title;
            this.words = opts.collection;
            this.render();
        },

        addToVocabList: function (evt) {
            var target = $(evt.target);
            if (target.parents('tr').length > 0) {
                var wordId = target.parents('tr').attr('data-id');
                App.VocabListView.addToVocabList(wordId);
                console.log(wordId);
            }
        },

        render: function () {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({
                title: this.title,
                words: this.words.toJSON()
            }));
            $('#word-holder').html(this.$el);
        }

    });

    return VocabView;
});