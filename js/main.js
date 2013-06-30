/** Backbone Models/Collections **/
var ContentModel = Backbone.Model.extend({ title: "", content:""});
var ContentCollection = Backbone.Collection.extend({
                                                   model: ContentModel
});
var ContentContainer = Backbone.Model.extend({
                                             title: "",
                                             details: "",
                                             content: ContentCollection
});
var Word = Backbone.Model.extend({
									word: "",
									romanization: "",
                                 translation: "",
                                 synonyms: "",
                                 particle:""
         });
var WordGroup = Backbone.Collection.extend({
                                        model: Word
});
var Vocab = Backbone.Model.extend({
							   enGroup: WordGroup,
							   krGroup: WordGroup
         });
var VocabGroup = Backbone.Collection.extend({ 
        model: Vocab
});		 

var VocabContainer = Backbone.Model.extend({
     title: "",
	 vocabs: VocabGroup
});

/** functions **/
function applyPopups() {
	_.each($("[data-toggle='popover']"),function(word) {
           $(word).on('click',function(e) {e.preventDefault();});
           $(word).popover({html:true,placement:'top'});
           });
}

function renderView(jsonContent) {

    /** populate and render lesson content **/
    if (jsonContent.contents) {
               var lessonContentCol = new ContentCollection();

       /** for each content data, create a new content model **/
              _.each(jsonContent.contents, function(contentmodel) {
                     lessonContentCol.add(new ContentModel(contentmodel));
                     });

              App.ContentContainer.set({title:jsonContent['title'],details:jsonContent['details'], content: lessonContentCol});
    } 

    /** populate and render lesson vocab **/

    else if (jsonContent.vocabs) {
              var vocabGroup = new VocabGroup();

        /** for each vocab data, create a new word model **/
              _.each(jsonContent.vocabs, function(vocab) {
                     var vocabModel = new Vocab();
                     
                     var krWordGroup = new WordGroup();
                     //loop over korean words
                     _.each(vocab.krGroup, function(krWord) {
                            krWordGroup.add(new Word(krWord));
                        });
                     
                     var enWordGroup = new WordGroup();
                     //loop over english words
                     _.each(vocab.enGroup, function(enWord) {
                            enWordGroup.add(new Word(enWord));
                        });
                     vocabModel.set({enGroup:enWordGroup,krGroup:krWordGroup});
                     vocabGroup.add(vocabModel);
                     });

              App.VocabContainer.set({title:jsonContent['title'],vocabs:vocabGroup});
                   applyPopups();
    } 
}

/** this function populates the model objects from json and renders the view **/
function loadJSON(lessonName) {
    $.getJSON("json/"+lessonName+".json", function(data){
              
              /** get content for Vocab **/
              var lessonContent = data[lessonName+"-content"];

              renderView(lessonContent);
              
              /** get vocab for Vocab **/
              var lessonVocab = data[lessonName+"-vocab"];        

              renderView(lessonVocab);
              
              }).done(function() {
                      console.log('done');
              });
}

/** Handlebar Helpers **/
Handlebars.registerHelper('content-helper', function(contentcol) {
      var out = "";
                          
      //loop over backbone collection
       _.each(contentcol.models, function(contentmodel) {
              var title = contentmodel.get('title'),
              content = contentmodel.get('content');
              if (title) {
                out += "<h2>" + title + "</h2>";
              }
              if (content) {
              out += content;
              }
              });
      return out;
});
                          
Handlebars.registerHelper('vocab-helper', function(vocabgroup) {
    var out = "";
	 
	 //loop over backbone collection
	_.each(vocabgroup.models, function(vocab) {
		out += "<div class='hero-unit'>";
	   _.each(vocab.get("krGroup").models, function(krWord) {
	   	 var romanization = krWord.get('romanization'), translation = krWord.get('translation'), synonyms = krWord.get('synonyms'), toolTipContent = "";
		 if (romanization) {
		 toolTipContent += "<h3>" + romanization + "</h3>";
		 } 
		 if (translation) {
		 toolTipContent += "<h3>" + translation + "</h3>";
		 } 
		 if (synonyms) {
		 toolTipContent += "<h3>" + synonyms + "</h3>";
		 }
         var classNames = "korean-word";
         if (krWord.get('particle')) {
              classNames += " particle";
          } else {
              classNames += " phrase";
          }
	     out += "<span class='" + classNames + "'><a href='#' data-toggle='popover' title='"+toolTipContent+"'>";
		 out += krWord.get('word');
         out += "</a></span>";
	   });
        out += "<p></p>";
	   _.each(vocab.get("enGroup").models, function(enWord) {
	     var translation = enWord.get('translation'), synonyms = enWord.get('synonyms'), toolTipContent = "";
		 if (translation) {
		 toolTipContent += "<h3>" + translation + "</h3>";
		 }
		 if (synonyms) {
		 toolTipContent += "<h3>" + synonyms + "</h3>";
		 }
         var classNames = "english-word";
         if (enWord.get('particle')) {
              classNames += " particle";
          } else {
              classNames += " phrase";
          }
		 out += "<span class='" + classNames + "'><a href='#' data-toggle='popover' title='"+toolTipContent+"'>";
         out += enWord.get('word');
         out += "</a></span>";
	   });
		out += "</div>";
	});
	return out;
});

/** Routers **/
var AppRouter = Backbone.Router.extend({
	routes: {
		"":"home",
		"lesson1":"lesson1",
		"lesson2":"lesson2",
    "lesson3":"lesson3",
    "lesson4":"lesson4"
	},
	
	home:function() {
        loadJSON("home");
	},
	
	lesson1:function() {
        loadJSON("lesson1");
    },
    
    lesson2:function() {
        loadJSON("lesson2");
    },

    lesson3:function() {
      loadJSON("lesson3");
    },

    lesson4:function() {
      loadJSON("lesson4");
    }
                                       
});

/** Backbone Views **/ 
var ContentView = Backbone.View.extend({
                                    model: null,
                                    el: $("#content-holder"),
                                    initialize: function() {
                                       this.model.on('change', this.render, this);
                                    },
                                    render: function() {
                                       var source = $("#content-template").html();
                                       var template = Handlebars.compile(source);
                                       this.$el.html(template(this.model.toJSON()));
                                       console.log(this.model.toJSON());
                                    }
});

var VocabView = Backbone.View.extend({
                                     model: null,
                                     el: $("#vocab-holder"),
                                     initialize: function() {
                                        this.model.on('change', this.render, this);
                                     },
                                     render: function(){
                                        var source = $("#vocab-template").html();
                                        var template = Handlebars.compile(source);
                                        this.$el.html(template(this.model.toJSON()));
                                         console.log(this.model.toJSON());
                                     }
});

/** init **/
$(function() {
     App = {};
     App.AppRouter = new AppRouter();
     App.ContentContainer = new ContentContainer();
     App.VocabContainer = new VocabContainer();
     App.ContentView = new ContentView({model:App.ContentContainer});
     App.VocabView = new VocabView({model:App.VocabContainer});
     Backbone.history.start();
});
