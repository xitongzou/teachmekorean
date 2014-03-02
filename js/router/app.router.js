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
            var header = new HeaderView();
            $('#header').html(header.$el);
            return header;
        },

        renderFooter: function () {
            var footer = new FooterView();
            $('#footer').html(footer.$el);
            return footer;
        },

        renderSidebar: function () {
            var sidebar = new SidebarView();
            $('#sidebar').html(sidebar.$el);
            return sidebar;
        },

        renderVocab: function () {
            var vocab = new VocabView();
            $('#vocab').html(vocab.$el);
            return vocab;
        },

        renderContentView: function (contentArray) {
            var title = contentArray.title;
            var contentCollection = new ContentCollection();
            _.each(contentArray.content, function (content) {
                contentCollection.add(new ContentModel(content));
            });
            var contentView = new ContentView({
                title: title,
                collection: contentCollection
            });
            $('#content-holder').html(contentView.$el);
            return contentView;
        },

        renderWordView: function (wordArray) {
            var self = this;
            var title = wordArray.title;
            var wordCollection = new WordCollection();
            _.each(wordArray.words, function (word) {
                var wordModel = new WordModel(word);
                var dataid = self.escape(word.word+word.translation);
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
            var wordView = new WordView({
                title: title,
                collection: wordCollection
            });
            $('#word-holder').html(wordView.$el);
            return wordView;
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
        }

    });

    return AppRouter;
});