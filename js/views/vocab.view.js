define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'word.model',
    'word.collection'
], function ($, _, Backbone, Handlebars, WordModel, WordCollection) {

    var VocabView = Backbone.View.extend({

        tagName: 'div',
        className: 'vocab-content col-sm-3 well well-small',
        template: '#vocab-list-template',
        words: null,

        initialize: function () {
            this.words = new WordCollection();
            this.render(this.words);
        },

        render: function (collection) {
            var source = $(this.template).html();
            var template = Handlebars.compile(source);
            this.$el.html(template({
                words: collection.toJSON()
            }));
            $('#vocab').html(this.$el);
        },

        addToVocabList: function (wordId) {
            var wordModel = new WordModel({
                word: wordId.split("-")[0],
                translation: wordId.split("-")[1]
            });
            this.words.add(wordModel);
            this.render(this.words);
        }

    });

    return VocabView;
});