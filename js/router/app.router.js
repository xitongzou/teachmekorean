define([
    'jquery',
    'underscore',
    'backbone',
    'header.view',
    'footer.view',
    'sidebar.view',
    'vocab.view'
], function ($, _, Backbone, HeaderView, FooterView, SidebarView, VocabView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
           // "": "home"
        },

        home: function () {
            this.loadJSON("home");
        },

        initialize: function () {

            this.renderHeader();
            this.renderFooter();
            this.renderSidebar();
            this.renderVocab();

            /*            // Matches #lesson/10, passing "10"
             this.route("lesson/:number", "page", function (number) {
             this.loadJSON("lesson" + number);
             });

             // Matches #lesson/10, passing "10"
             this.route("vocab/:number", "page", function (number) {
             this.loadJSON("vocab" + number);
             });*/

        },

        /** this function populates the model objects from json and renders the view **/
        loadJSON: function (lessonName) {
            $.getJSON("json/" + lessonName + ".json",function (data) {

                /** get content for Vocab **/
                var lessonContent = data[lessonName + "-content"];

                this.renderView(lessonContent);

                /** get vocab for Vocab **/
                var lessonVocab = data[lessonName + "-vocab"];

                this.renderView(lessonVocab);

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

        renderView: function (jsonContent) {

            /** populate and render lesson content **/
            if (jsonContent.contents) {
                var lessonContentCol = new ContentCollection();

                /** for each content data, create a new content model **/
                _.each(jsonContent.contents, function (contentmodel) {
                    lessonContentCol.add(new ContentModel(contentmodel));
                });

                App.ContentContainer.set({title: jsonContent['title'], details: jsonContent['details'], content: lessonContentCol});
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