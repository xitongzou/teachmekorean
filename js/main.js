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
/* To enable an element to follow you down the page smoothly */
function enableFollowNav(navElement, padding) {
            var $sidebar = navElement,
                $window = $(window),
                offset = $sidebar.offset(),
                topPadding = padding;

            $window.scroll(function() {
                if ($window.scrollTop() > offset.top) {
                    $sidebar.stop().animate({
                        marginTop: $window.scrollTop() - offset.top + topPadding
                    });
                } else {
                    $sidebar.stop().animate({
                        marginTop: 0
                    });
                }
            });
        }

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
		out += "<div class='page-header'>";
	   _.each(vocab.get("krGroup").models, function(krWord) {
	   	 var romanization = krWord.get('romanization'), 
       word = krWord.get('word'),
       translation = krWord.get('translation'), 
       synonyms = krWord.get('synonyms'), 
       base = krWord.get('base'),
       id = krWord.get('id'),
       toolTipContent = "";
		 if (romanization) {
		 toolTipContent += "<h4>" + romanization + "</h4>";
		 } 
		 if (translation) {
		 toolTipContent += "<h4>" + translation + "</h4>";
		 } 
		 if (synonyms) {
		 toolTipContent += "<h4>" + synonyms + "</h4>";
		 }
     if (base) {
      toolTipContent += "<h4>" + base + "</h4>";
     }
     toolTipContent += "<h4><a>Add to vocab list</a></h4>"; 
         var classNames = "korean-word";
         if (krWord.get('particle')) {
              classNames += " particle";
          } else {
              classNames += " phrase";
          }
	     out += "<span class='" + classNames + "'><a href='#' class='popover-link' ";
       out += "data-id='" + word + translation + "'";
       out += " data-toggle='popover' title='"+toolTipContent+"'>";
		 out += word;
         out += "</a></span>";
             //add to hash map
             App.VocabListMap[word+translation] = krWord;
	   });
        out += "<p></p>";

	   _.each(vocab.get("enGroup").models, function(enWord) {
	     var translation = enWord.get('translation'), synonyms = enWord.get('synonyms'), toolTipContent = "";
		 if (translation) {
		 toolTipContent += "<h4>" + translation + "</h4>";
		 }
		 if (synonyms) {
		 toolTipContent += "<h4>" + synonyms + "</h4>";
		 }
         var classNames = "english-word";
         if (enWord.get('particle')) {
              classNames += " particle";
          } else {
              classNames += " phrase";
          }
		 out += "<span class='" + classNames + "'><a href='#' class='popover-link' data-toggle='popover' title='"+toolTipContent+"'>";
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
    "lesson4":"lesson4",
    "vocab1":"vocab1",
    "vocab2":"vocab2",
    "vocab3":"vocab3",
    "vocab4":"vocab4",
    "vocab5":"vocab5",
    "vocab6":"vocab6",
    "vocab7":"vocab7",
    "vocab8":"vocab8",
    "vocab9":"vocab9",
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
    },

    vocab1: function() {
      loadJSON("vocab1");
    },

    vocab2: function() {
      loadJSON("vocab2");
    },
        vocab3: function() {
      loadJSON("vocab3");
    },
        vocab4: function() {
      loadJSON("vocab4");
    },
        vocab5: function() {
      loadJSON("vocab5");
    },
        vocab6: function() {
      loadJSON("vocab6");
    },
        vocab7: function() {
      loadJSON("vocab7");
    },

        vocab8: function() {
      loadJSON("vocab8");
    },

        vocab9: function() {
      loadJSON("vocab9");
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
                                     events: {
                                      "click a" : "addToVocabList"
                                     },
                                     render: function(){
                                        var source = $("#vocab-template").html();
                                        var template = Handlebars.compile(source);
                                        this.$el.html(template(this.model.toJSON()));
                                         console.log(this.model.toJSON());
                                     },
                                     addToVocabList: function(evt) {
                                        var target = $(evt.target);
                                        if (target.parents('.popover').length > 0) {
                                          var wordId = target.parents('.popover').prev('.popover-link').attr('data-id');
                                          App.VocabList.add(App.VocabListMap[wordId]);
                                          console.log(wordId);
                                        }
                                     }
});

var VocabListView = Backbone.View.extend({
    model: null,
    el: $('#vocab-list-holder'),
    initialize: function() {
      this.model.on('add', this.render, this);
    },
    render: function() {
      console.log('something was added to the collection');
      var source = $('#vocab-list-template').html();
      var template = Handlebars.compile(source);
      this.$el.html(template({words:this.model.toJSON()}));
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
     App.VocabList = new Backbone.Collection();
     App.VocabListView = new VocabListView({model:App.VocabList});
     App.VocabListMap = {};
     Backbone.history.start();
     enableFollowNav($('#sidebar-nav'), 20);
     enableFollowNav($('#vocab-section'), 20);
});
