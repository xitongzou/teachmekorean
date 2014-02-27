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
    'word.view'
], function ($, _, Backbone, HeaderView, FooterView, SidebarView, VocabView, ContentModel, ContentCollection, ContentView, WordModel, WordCollection, WordView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "home"
        },

        home: function () {
            this.loadJSON("home");
        },

        initialize: function () {

            this.renderHeader();
            this.renderFooter();
            this.renderSidebar();
            this.renderVocab();

            // Matches #lesson/10, passing "10"
            this.route("lesson/:number", "page", function (number) {
                this.loadJSON("grammar" + number);
            });

            // Matches #vocab/10, passing "10"
            this.route("vocab/:number", "page", function (number) {
                this.loadJSON("vocab" + number);
            });
        },

        /** this function populates the model objects from json and renders the view **/
        loadJSON: function (lessonName) {
            var self = this;

            $.getJSON("json/" + lessonName + ".json",function (data) {

                /** get content **/
                var lessonContent = data[lessonName + "-content"];

                if (lessonContent) {
                    self.renderContentView(lessonContent);
                }

                /** get words **/
                var lessonWords = data[lessonName + "-words"];

                if (lessonWords) {
                    self.renderWordView(lessonWords);
                }

            }).done(function () {
                    console.log('done');
                });
        },

        renderHeader: function () {
            var header = new HeaderView();
            $('#header').html(header.$el);
        },

        renderFooter: function () {
            var footer = new FooterView();
            $('#footer').html(footer.$el);
        },

        renderSidebar: function () {
            var sidebar = new SidebarView();
            $('#sidebar').html(sidebar.$el);
        },

        renderVocab: function () {
            var vocab = new VocabView();
            $('#vocab').html(vocab.$el);
        },

        renderContentView: function (contentArray) {
            var contentCollection = new ContentCollection();
            _.each(contentArray, function (content) {
                contentCollection.add(new ContentModel(content));
            });
            var contentView = new ContentView(contentCollection);
            $('#content-holder').html(contentView.$el);
        },

        renderWordView: function (wordArray) {
            var self = this;
            var wordCollection = new WordCollection();
            _.each(wordArray, function (word) {
                var wordModel = new WordModel(word);
                var dataid = self.escape(word.word+word.translation);
                var toolTip = "<button>&times;</button>" +
                    "<h4>" + word.translation + "</h4>" +
                    "<h4><a>Add to vocab list</a></h4>";
                wordModel.set({
                    "dataid":dataid,
                    "tooltip":toolTip
                });
                wordCollection.add(wordModel);
            });
            var wordView = new WordView(wordCollection);
            $('#word-holder').html(wordView.$el);
            this.applyPopups();
        },

        applyPopups: function () {
            _.each($("[data-toggle='popover']"), function (word) {
                $(word).on('click', function (e) {
                    e.preventDefault();
                });
                $(word).popover({html: true, placement: 'top'});
            });
        },

        escape: function (string) {
            return String(string).replace(/[&<>",;'\s\/]/g, "");
        },

        renderView: function (jsonContent) {

            /** populate and render lesson content **/
            if (jsonContent) {
                var lessonContentCol = new ContentCollection();

                /** for each content data, create a new content model **/
                _.each(jsonContent, function (contentmodel) {
                    lessonContentCol.add(new ContentModel(contentmodel));
                });
            }

            /** populate and render lesson vocab **/

            else if (jsonContent.vocabs) {
                var vocabGroup = new VocabGroup();

                /** for each vocab data, create a new word model **/
                _.each(jsonContent.vocabs, function (vocab) {
                    var vocabModel = new Vocab();

                    var krWordGroup = new WordGroup();
                    //loop over korean words
                    _.each(vocab.krGroup, function (krWord) {
                        krWordGroup.add(new Word(krWord));
                    });

                    var enWordGroup = new WordGroup();
                    //loop over english words
                    _.each(vocab.enGroup, function (enWord) {
                        enWordGroup.add(new Word(enWord));
                    });
                    vocabModel.set({enGroup: enWordGroup, krGroup: krWordGroup});
                    vocabGroup.add(vocabModel);
                });

                App.VocabContainer.set({title: jsonContent['title'], vocabs: vocabGroup});
                applyPopups();
            }
        }

    });

    return AppRouter;
});