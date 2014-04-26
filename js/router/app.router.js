define([
    'jquery',
    'underscore',
    'backbone',
    'header.view',
    'footer.view',
    'sidebar.view',
    'vocab.view',
    'vocab.list.view',
    'content.model',
    'content.collection',
    'content.view',
    'word.model',
    'word.collection',
    'word.view',
    'sentence.model',
    'sentence.collection'
], function ($, _, Backbone, HeaderView, FooterView, SidebarView, VocabView, VocabListView, ContentModel, ContentCollection, ContentView, WordModel, WordCollection, WordView, SentenceModel, SentenceCollection) {

    var AppRouter = Backbone.Router.extend({

        container: null,

        routes: {
            "": "home",
            "!": "home",
            "!/about": "about",
            "!/contact": "contact"
        },

        home: function () {
            this.loadView("", "home");
        },

        about: function () {
            this.loadView("", "about");
        },

        contact: function () {
            this.loadView("", "contact");
        },

        initialize: function () {

            this.container = new Backbone.ChildViewContainer();

            this.renderHeader();
            this.renderFooter();
            this.renderSidebar();

            this.route("!/lesson/:level/:name", "lesson", function (level, name) {
                this.loadView(level, name);
            });

            this.route("grammar/:id", "page", function (id) {
                this.loadView(id);
            });

            this.route("vocab/:id", "page", function (id) {
                this.loadView(id);
            });

            // Matches remove routes
            this.route("remove/:id", function (id) {
                App.VocabListView.removeFromVocabList(id);
            });
        },

        loadView: function (level, name) {
            var contentid = "";
            var wordid = "";
            var vocabid = "";

            if (level) {
                contentid += level + "-";
                wordid += level + "-";
                vocabid += level + "-";
            }

            contentid += name + "-content";
            wordid += name + "-words";
            vocabid += name + "-vocab";

            this.container.call('remove');

            var contentView = this.container.findByCustom(contentid);
            var wordView = this.container.findByCustom(wordid);
            var vocabView = this.container.findByCustom(vocabid);

            if (contentView) {
                $('#content-holder').html(contentView.$el);
            }

            if (wordView) {
                $('#word-holder').html(wordView.$el);
                this.applyPopups();
            }

            if (!contentView || !wordView || !vocabView) {
                this.loadJSON(level, name);
            }

            //apply animation effects
            var $selectedLesson = $("." + name);
            var $collapsed = $('.collapse.in');
            _.forEach($collapsed, function (elm) {
                if (elm.id !== level) {
                    $(elm).collapse('hide');
                }
            });
            $('#' + level).collapse("show");
            $('.selected').removeClass("selected");
            $selectedLesson.addClass("selected");
        },

        /** this function populates the model objects from json and renders the view **/
        loadJSON: function (level, name) {

            var self = this;
            var contentid = "";
            var wordid = "";
            var vocabid = "";
            var jsonFile = "json/";

            if (level) {
                contentid += level + "-";
                wordid += level + "-";
                vocabid += level + "-";
                jsonFile += level + "/";
            }

            contentid += name + "-content";
            wordid += name + "-words";
            vocabid += name + "-vocab";
            jsonFile += name + ".json";


            $.getJSON(jsonFile,function (data) {

                /** the 'level' prefix isn't needed in the json,
                 *  but we still need the view container to index it more uniquely
                 */

                /** get content **/
                var lessonContent = data[name + "-content"];

                /** get words **/
                var lessonWords = data[name + "-words"];

                /** get vocab table **/
                var lessonVocab = data[name + "-vocab"];

                if (lessonContent) {
                    self.container.add(self.renderContentView(lessonContent), contentid);
                }

                if (lessonWords) {
                    self.container.add(self.renderWordView(lessonWords), wordid);
                }

                if (lessonVocab) {
                    self.container.add(self.renderVocabView(lessonVocab), vocabid);
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

        renderContentView: function (contentArray) {
            var title = contentArray.title;
            var button = contentArray.button;
            var contentCollection = new ContentCollection();
            _.each(contentArray.content, function (content) {
                contentCollection.add(new ContentModel(content));
            });
            return new ContentView({
                title: title,
                button: button,
                collection: contentCollection
            });
        },

        renderVocabView: function (vocabArray) {
            var title = vocabArray.title;
                var wordCollection = new WordCollection();
                _.each(vocabArray.words, function (word) {
                    var wordModel = new WordModel(word);
                    var dataid = word.word + "-" + word.translation;
                    var content =
                        "<h4>" + word.translation + "</h4>" +
                            "<h4><a>Add to vocab list</a></h4>";
                    var title = "<button>&times;</button>";
                    wordModel.set({
                        "dataid": dataid,
                        "title": title,
                        "content": content
                    });
                    wordCollection.add(wordModel);
                });
            return new VocabView({
                title: title,
                collection: wordCollection
            });
        },

        renderWordView: function (wordArray) {
            var title = wordArray.title;
            var sentenceCollection = new SentenceCollection();
            _.each(wordArray.sentences, function (sentence) {
                var wordCollection = new WordCollection();
                _.each(sentence.words, function (word) {
                    var wordModel = new WordModel(word);
                    var dataid = word.word;
                    var title = '';
                    if (word.root) {
                        dataid = word.root;
                        title = word.root;
                    }
                    dataid += "-" + word.translation;
                    title += "<button>&times;</button>";
                    var content =
                        "<h4>" + word.translation + "</h4>" +
                            "<h4><a>Add to vocab list</a></h4>";
                    wordModel.set({
                        "dataid": dataid,
                        "title": title,
                        "content": content,
                        "particle": word.particle
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