define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'word.collection'
], function ($, _, Backbone, Handlebars, WordCollection) {

    var VocabView = Backbone.View.extend({

        tagName: 'div',
        className: 'vocab-content col-sm-3',
        template: '#vocab-template',
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
        }

    });

    return VocabView;
});