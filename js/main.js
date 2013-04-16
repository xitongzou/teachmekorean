/** Backbone Models **/
var HomeContentModel = Backbone.Model.extend({ });
var homecontent = new HomeContentModel();
homecontent.set({title: "Teach Me Korean!!", 
content: "Learn Korean by starting off with simple sentences with mouseovers for each word, and learn to combine words together to create proper sentences and structures.",
 details: "Learn more &raquo;"});
var Word = Backbone.Model.extend({
									word: '',
									romanization: ''
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

var Content = Backbone.Model.extend({
	  heading: "",
	  content: ""
});

var LessonContainer = Backbone.Model.extend({
     title: "",
	 body: Content,
	 lessons: LessonGroup
});

/** Handlebar Helpers **/
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
		out += "</div";
	});
	return out;
});
		 
/** Backbone Views **/ 
var HomeView = Backbone.View.extend({
                                initialize: function() {
                                    this.render();
                                    },  
                                render: function() {
                                var source = $("#header-template").html();
                                var template = Handlebars.compile(source);
                                this.$el.html(template(homecontent.toJSON()));
                                }
});
var homeView = new HomeView({el: $("#header-holder")});
var Lesson1View = Backbone.View.extend({
						render: function() {
						
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
							lessonGroup.add(lesson1);
							lessonGroup.add(lesson2);
							
							var lessonCon = new LessonContainer();
							lessonCon.set({title:"Lesson 1 - Hello and Thank You",lessons: lessonGroup});
							var source = $("#lesson-template").html();
							var template = Handlebars.compile(source);
                            this.$el.html(template(lessonCon.toJSON()));
						}
});

/** functions **/
function applyTooltips() {
	_.each($("[data-toggle='tooltip']"),function(word) {
		$(word).tooltip({html:true});
	});
}

$('.lesson-list').on('click', function(evt) {
	var className = evt.target.className;
    if (className === "lesson-1") {
	  var lesson1view = new Lesson1View({el: $("#lesson-holder")});
	  lesson1view.render();
	}
	applyTooltips();
});

