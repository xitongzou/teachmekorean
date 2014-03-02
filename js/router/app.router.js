define([
    'jquery',
    'underscore',
    'backbone',
    'header.view',
    'footer.view',
    'sidebar.view',
    'vocab.view',
    'content.model',
    'content.collection',
    'content.view',
    'word.model',
    'word.collection',
    'word.view',
    'sentence.model',
    'sentence.collection'
], function ($, _, Backbone, HeaderView, FooterView, SidebarView, VocabView, ContentModel, ContentCollection, ContentView, WordModel, WordCollection, WordView, SentenceModel, SentenceCollection) {

    var AppRouter = Backbone.Router.extend({

        container: null,

        routes: {
            "": "home"
        },

        home: function () {
            this.loadView("home");
        },

        initialize: function () {

            this.container = new Backbone.ChildViewContainer();

            this.renderHeader();
            this.renderFooter();
            this.renderSidebar();
            this.renderVocab();

            // Matches #lesson/10, passing "10"
            this.route("lesson/:number", "page", function (number) {
                this.loadView("grammar" + number);
            });

            // Matches #vocab/10, passing "10"
            this.route("vocab/:id", "page", function (id) {
                this.loadView("vocab-" + id);
            });
        },

        loadView: function (lessonName) {
            var contentid = lessonName + "-content";
            var wordid = lessonName + "-words";

            this.container.call('remove');

            var contentView = this.container.findByCustom(contentid);
            var wordView = this.container.findByCustom(wordid);

            if (contentView) {
                $('#content-holder').html(contentView.$el);
            }

            if (wordView) {
                $('#word-holder').html(wordView.$el);
                this.applyPopups();
            }

            if (!contentView || !wordView) {
                this.loadJSON(lessonName);
            }
        },

        /** this function populates the model objects from json and renders the view **/
        loadJSON: function (lessonName) {

            var self = this;
            var contentid = lessonName + "-content";
            var wordid = lessonName + "-words";

            $.getJSON("json/" + lessonName + ".json",function (data) {

                /** get content **/
                var lessonContent = data[contentid];

                /** get words **/
                var lessonWords = data[wordid];

                if (lessonContent) {
                    self.container.add(self.renderContentView(lessonContent),contentid);
                }

                if (lessonWords) {
                    self.container.add(self.renderWordView(lessonWords),wordid);
                }

            }).done(function () {
                self.applyPopups();
                console.log('done');
            });
        },

        renderHeader: function () {
            return new HeaderView();
        },

        renderFooter: function () {
            return new FooterView();
        },

        renderSidebar: function () {
            return new SidebarView();
        },

        renderVocab: function () {
            return new VocabView();
        },

        renderContentView: function (contentArray) {
            var title = contentArray.title;
            var contentCollection = new ContentCollection();
            _.each(contentArray.content, function (content) {
                contentCollection.add(new ContentModel(content));
            });
            return new ContentView({
                title: title,
                collection: contentCollection
            });
        },

        renderWordView: function (wordArray) {
            var title = wordArray.title;
            var sentenceCollection = new SentenceCollection();
            _.each(wordArray.sentences, function (sentence) {
                var wordCollection = new WordCollection();
                _.each(sentence.words, function (word) {
                    var wordModel = new WordModel(word);
                    var dataid = word.word + "-" + word.translation;
                    var content =
                        "<h4>" + word.translation + "</h4>" +
                            "<h4><a>Add to vocab list</a></h4>";
                    var title =
                        "<button>&times;</button>";
                    wordModel.set({
                        "dataid":dataid,
                        "title": title,
                        "content":content
                    });
                    wordCollection.add(wordModel);
                });

                sentenceCollection.add(new SentenceModel({
                    translation: sentence.translation,
                    words: wordCollection.toJSON()
                }));
            });
            return new WordView({
                title: title,
                collection: sentenceCollection
            });
        },

        applyPopups: function () {
            _.each($("[data-toggle='popover']"), function (word) {
                $(word).on('click', function (e) {
                    e.preventDefault();
                });
                $(word).popover({html: true, placement: 'top'});
            });
        }

    });

    return AppRouter;
});