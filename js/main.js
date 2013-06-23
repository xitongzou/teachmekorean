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
var Lesson = Backbone.Model.extend({
							   enGroup: WordGroup,
							   krGroup: WordGroup
         });
var LessonGroup = Backbone.Collection.extend({ 
        model: Lesson
});		 

var LessonContainer = Backbone.Model.extend({
     title: "",
	 lessons: LessonGroup
});

/** functions **/
function applyPopups() {
	_.each($("[data-toggle='popover']"),function(word) {
           $(word).on('click',function(e) {e.preventDefault();});
           $(word).popover({html:true,placement:'top'});
           });
}

function disposeViews(newView) {
    if (newView !== App.views.currentView) {
    _.each(App.views.activeViews, function(view) {
           //view.remove() actually deletes the dom element - we just want to erase the content
           view.$el.html("");
           });
    }
    App.views.currentView = newView;
}

function renderView(type,lessonName) {
    disposeViews(lessonName);
    if (type === "content") {
       App.views.activeViews.push(new ContentView({el: $("#content-holder"), model: lessonName}));
    } else if (type === "vocab") {
       App.views.activeViews.push(new VocabView({el:$("#vocab-holder"), model: lessonName}));
    }
}

function loadAndRender(lessonName){
    //load from cache if it exists, otherwise fetch the json and populate
    if (App.lessons[lessonName]) {
      if (App.lessons[lessonName].lessonContentCon) {
          renderView("content",lessonName);   
      }
      if (App.lessons[lessonName].lessonVocabCon) {
          renderView("vocab", lessonName);
          applyPopups();
      }
    } else {
        App.lessons[lessonName] = {};
        loadJSON(lessonName);
    }
}

/** this function populates the model objects from json and renders the view **/
function loadJSON(lessonName) {
    $.getJSON("json/"+lessonName+".json", function(data){
              
              /** get content for lesson **/
              var lessonData = data[lessonName+"-content"];
              
              if (lessonData.title.length > 0) {
              
              App.lessons[lessonName].lessonContentCon = new ContentContainer();
              var lessonContentCol = new ContentCollection();
              
              /** for each content data, create a new content model **/
              _.each(lessonData.contentCol, function(contentmodel) {
                     var lessonContent = new ContentModel();
                     lessonContent.set({title:contentmodel.title,
                                       content:contentmodel.content});
                     lessonContentCol.add(lessonContent);
                     });
              

              App.lessons[lessonName].lessonContentCon.set({title:lessonData['title'],details:lessonData['details'], content: lessonContentCol});
              
              renderView("content",lessonName); 
              
              }
              
              /** get vocab for lesson **/
              var vocabData = data[lessonName+"-vocab"];
              
              if (vocabData.title.length > 0) {
              
              App.lessons[lessonName].lessonVocabCon = new LessonContainer();
              var lessonGroup = new LessonGroup();
              
              /** for each vocab data, create a new word model **/
              _.each(vocabData.lessons, function(lesson) {
                     var lessonModel = new Lesson();
                     
                     var krWordGroup = new WordGroup();
                     //loop over korean words
                     _.each(lesson.krGroup, function(krWord) {
                            krWordGroup.add(new Word({word:krWord.word,romanization:krWord.romanization,translation:krWord.translation,base:krWord.base,synonyms:krWord.synonyms,particle:krWord.particle}));
                        });
                     
                     var enWordGroup = new WordGroup();
                     //loop over english words
                     _.each(lesson.enGroup, function(enWord) {
                            enWordGroup.add(new Word({word:enWord.word,translation:enWord.translation,synonyms:enWord.synonyms,particle:enWord.particle}));
                        });
                     lessonModel.set({enGroup:enWordGroup,krGroup:krWordGroup});
                     lessonGroup.add(lessonModel);
                     });
              App.lessons[lessonName].lessonVocabCon.set({title:vocabData['title'],
                                                               lessons:lessonGroup});
              
              renderView("vocab", lessonName);
              applyPopups();
              }
              
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
                          
Handlebars.registerHelper('lesson-helper', function(lessonGroup) {
    var out = "";
	 
	 //loop over backbone collection
	_.each(lessonGroup.models, function(lesson) {
		out += "<div class='hero-unit'>";
	   _.each(lesson.get("krGroup").models, function(krWord) {
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
	   _.each(lesson.get("enGroup").models, function(enWord) {
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
		"lesson2":"lesson2"
	},
	
	home:function() {
		console.log('home');
        loadAndRender("home");
	},
	
	lesson1:function() {
        console.log('lesson1');
        loadAndRender("lesson1");
    },
    
    lesson2:function() {
        console.log('lesson2');
        loadAndRender("lesson2");
    },
       
	update:function(e) {
		model = wines.get(e);
		new UpdateView({model:model});
	}
                                       
});

/** Backbone Views **/ 
var ContentView = Backbone.View.extend({
                                    model: null,
                                    initialize: function() {
                                       this.render();
                                    },
                                    render: function() {
                                       var source = $("#content-template").html();
                                       var template = Handlebars.compile(source);
                                       this.$el.html(template(App.lessons[this.model].lessonContentCon.toJSON()));
                                       console.log(App.lessons[this.model].lessonContentCon.toJSON());
                                    }
});

var VocabView = Backbone.View.extend({
                                     model: null,
                                     initialize: function() {
                                      this.render();
                                     },
                                     render: function(){
                                        var source = $("#lesson-template").html();
                                        var template = Handlebars.compile(source);
                                        this.$el.html(template(App.lessons[this.model].lessonVocabCon.toJSON()));
                                         console.log(App.lessons[this.model].lessonVocabCon.toJSON());
                                     }
});

/** init **/
$(function() {
     App = {};
     App.lessons = {};
     App.views = {};
     App.views.activeViews = [];
     App.views.currentView = "";
     App.AppRouter = new AppRouter();
     Backbone.history.start();
});
