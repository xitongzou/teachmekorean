/** Backbone Models **/
var ContentModel = Backbone.Model.extend({ title: "", content:""});
var ContentCollection = Backbone.Collection.extend({
                                                   model: ContentModel,
												   url: "#"
});
var ContentContainer = Backbone.Model.extend({
                                             title: "",
                                             details: "",
                                             content: ContentCollection
});
var Word = Backbone.Model.extend({
									word: "",
									romanization: ""
         });
var WordGroup = Backbone.Collection.extend({
                                        model: Word,
										url: "#"
});
var Lesson = Backbone.Model.extend({
							   enGroup: WordGroup,
							   krGroup: WordGroup
         });
var LessonGroup = Backbone.Collection.extend({ 
        model: Lesson,
		url: "#"
});		 

var LessonContainer = Backbone.Model.extend({
     title: "",
	 lessons: LessonGroup
});

/** functions **/
function applyTooltips() {
	_.each($("[data-toggle='tooltip']"),function(word) {
           $(word).tooltip({html:true});
           });
}

function loadLessonJSON(lesson) {
    $.getJSON("json/lessons.json", function(data){
              
              /** get data for lesson **/
              var lessonData = data[lesson+"-content"];
              var lessonContentCol = new ContentCollection();
              var lessonContentCon = new ContentContainer();
              
              /** for each content data, create a new content model **/
              _.each(lessonData.contentCol, function(contentmodel) {
                     var lessonContent = new ContentModel();
                     lessonContent.set({title:contentmodel.title,
                                       content:contentmodel.content});
                     lessonContentCol.add(lessonContent);
                     });
              

              lessonContentCon.set({title:lessonData['title'],details:lessonData['details'], content: lessonContentCol});
              var source = $("#header-template").html();
              var template = Handlebars.compile(source);
              $("#header-holder").html(template(lessonContentCon.toJSON()));
              console.log(lessonContentCon.toJSON());
              }).done(function() { console.log('done'); });
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
		 toolTipContent += "<h2>" + romanization + "</h2>";
		 } 
		 if (translation) {
		 toolTipContent += "<h2>" + translation + "</h2>";
		 } 
		 if (synonyms) {
		 toolTipContent += "<h2>" + synonyms + "</h2>";
		 }
	     out += "<h2 class='korean-word'><a href='#' data-toggle='tooltip' title='"+toolTipContent+"'>";
		 out += krWord.get('word');
		 out += "</a></h2>";
	   });
	   _.each(lesson.get("enGroup").models, function(enWord) {
	     var translation = enWord.get('translation'), synonyms = enWord.get('synonyms'), toolTipContent = "";
		 if (translation) {
		 toolTipContent += "<h2>" + translation + "</h2>";
		 }
		 if (synonyms) {
		 toolTipContent += "<h2>" + synonyms + "</h2>";
		 }
		 out += "<h2 class='english-word'><a href='#' data-toggle='tooltip' title='"+toolTipContent+"'>";
		 out += enWord.get('word');
		 out += "</h2>";
	   });
		out += "</div>";
	});
	return out;
});

/** Routers **/
AppRouter = Backbone.Router.extend({
	routes: {
		"":"home",
		"add":"add",
		"close":"home"
	},
	
	home:function() {
		console.log('home');
		new HomeView();
	},
	
	add:function() {
		new AddView();
	},
	
	update:function(e) {
		model = wines.get(e);
		new UpdateView({model:model});
	}
});
		 
/** Backbone Views **/ 
var HomeView = Backbone.View.extend({
								initialize: function() {
									this.collection.bind('all',this.render,this);
								},
                                render: function() {
                                    var homecontent = new ContentModel();
                                    homecontent.set({title: "",
                                                    content: "Learn Korean by starting off with simple sentences with mouseovers for each word, and learn to combine words together to create proper sentences and structures."});
                                    var homecontentCol = new ContentCollection();
                                    var homecontentCon = new ContentContainer();
                                    homecontentCol.add(homecontent);
                                    homecontentCon.set({title: "Teach Me Korean!!", details: "Learn more &raquo;", content: homecontentCol});
                                var source = $("#header-template").html();
                                var template = Handlebars.compile(source);
                                this.$el.html(template(homecontentCon.toJSON()));
                                }
});
var homeView = new HomeView({el: $("#header-holder")});
homeView.render();
var Lesson1View = Backbone.View.extend({
						template: "",
						events: {
						"click #addBtn": "add"
						},
						add: function(e) {
							e.preventDefault();
							return this;
						}
						render: function() {
							this.$el.empty();
						    /** Lesson 1 **/
							var word1 = new Word();
							word1.set({ word: "Hello", translation: "안녕하세요", synonyms: "Hi, Hey"});
							
							var wordGroup1 = new WordGroup();
							wordGroup1.add(word1);
							var word2 = new Word();
							word2.set({ word: "안녕하세요", romanization: "an-nyeong-ha-se-yo", translation: "Hello, Hi" });
							var wordGroup2 = new WordGroup();
							wordGroup2.add(word2);
							
							/** Lesson 2 **/
							var word3 = new Word();
							word3.set({ word: "Thank You", translation: "감사합니다", synonyms: "Thanks"});
							var wordGroup3 = new WordGroup();
							wordGroup3.add(word3);
							var word4 = new Word();
							word4.set({ word: "감사합니다", romanization: "kam-sa-ham-ni-da", translation: "Thank you, Thanks", synonyms: "고맙습니다"});
							var wordGroup4 = new WordGroup();
							wordGroup4.add(word4);
							
							
							var lesson1 = new Lesson();
							lesson1.set({enGroup:wordGroup1});
							lesson1.set({krGroup:wordGroup2});
							var lesson2 = new Lesson();
							lesson2.set({enGroup:wordGroup3});
							lesson2.set({krGroup:wordGroup4});
							
							var lessonGroup = new LessonGroup();
							lessonGroup.on('add',function(model) {
								console.log('added a new lesson');
							});
							lessonGroup.add(lesson1);
							lessonGroup.add(lesson2);
							
							var lessonCon = new LessonContainer();
							lessonCon.set({title:"Lesson 1 Vocabulary",lessons: lessonGroup});
							var source = $("#lesson-template").html();
							var template = Handlebars.compile(source);
                            this.$el.html(template(lessonCon.toJSON()));
						}
});

$('.lesson-list').on('click', function(evt) {
	var className = evt.target.className;
    if (className === "lesson-1") {
	  var lesson1view = new Lesson1View({el: $("#lesson-holder")});
	  lesson1view.render();
      loadLessonJSON("lesson1");
	}
	applyTooltips();
});

$(document).ready(function() {
	KoreanApp = new AppRouter();
	Backbone.history.start();
});
