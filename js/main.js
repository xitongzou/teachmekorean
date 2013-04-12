/*

var contentSource = $("#content-template").html();
var headerSource = $("#header-template").html();
var lessonSource = $("#lesson-template").html();
var contentTemplate = Handlebars.compile(contentSource);
var headerTemplate = Handlebars.compile(headerSource);
var lessonTemplate = Handlebars.compile(lessonSource);
var sectionData = { section: [
                     {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"},
                       {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"},
                        {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"},
                        {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"},
                              {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"},
                              {heading: "Heading", content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.", details: "View details &raquo;"}
                     ]
};
var Lesson1Data = { lesson: [{ english : "Hello", korean: "안녕하세요", romanized: "ann-nyeong-ha-se-yo"}, { english : "Thank you", korean: "감사합니다", romanized: "kam-sa-hap-ni-da" }] };
var Lesson2Data = { lesson: [{ english: "Yes", korean: "네", romanized: "ne" },
                             { english: "No", korean: "아니요", romanized: "an-ni-yo" }]};

var EnWord = Backbone.Model.extend({
                               initialize: function(){
                               alert("English word created");
                               }
         });
var KrWord = Backbone.Model.extend({
                               initialize: function() {
                               alert("Korean word created");
                               }
                               });
var LessonEnWords = Backbone.Collection.extend({
                                        model: EnWord
});
var LessonKrWords = Backbone.Collection.extend({
                                               model: KrWord
});
lesson.set({ english: "Yes", korean: "네", romanized: "ne" });
$("#header-holder").html(headerTemplate(headerData));
$("#content-holder").html(contentTemplate(sectionData));
$("#home").on('click',function(elem) {
              $("#lesson-holder").hide();
              $("#header-holder").html(headerTemplate(headerData));
              $("#header-holder").show();
              });
$(".lesson-1").on('click', function (elem) {
                  $("#header-holder").hide();
                  $("#lesson-holder").html(lessonTemplate(Lesson1Data));
                  $("#lesson-holder").show();
                  });
$(".lesson-2").on('click', function (elem) {
                  $("#header-holder").hide();
                  $("#lesson-holder").html(lessonTemplate(Lesson2Data));
                  $("#lesson-holder").show();
                  });
*/

/** Backbone Models **/
var HomeContentModel = Backbone.Model.extend({ });
var homecontent = new HomeContentModel();
homecontent.set({title: "Teach Me Korean!!", 
content: "Learn Korean by starting off with simple sentences with mouseovers for each word, and learn to combine words together to create proper sentences and structures.",
 details: "Learn more &raquo;"});
var Word = Backbone.Model.extend({
									word: ''
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
	     out += "<h2 class='korean-word'>";
		 out += krWord.get('word');
		 out += "</h2>";
	   });
	   _.each(lesson.get("enGroup").models, function(enWord) {
	     out += "<h2 class='english-word'>";
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
							word1.set({ word: "Hello"});
							var wordGroup1 = new WordGroup();
							wordGroup1.add(word1);
							var word2 = new Word();
							word2.set({ word: "안녕하세요" });
							var wordGroup2 = new WordGroup();
							wordGroup2.add(word2);
							
							/** Lesson 2 **/
							var word3 = new Word();
							word3.set({ word: "Thank You" });
							var word3a = new Word();
							word3a.set({ word: "Thanks!!"});
							var wordGroup3 = new WordGroup();
							wordGroup3.add(word3);
							wordGroup3.add(word3a);
							var word4 = new Word();
							word4.set({ word: "감사합니다" });
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

$('.lesson-list').on('click', function(evt) {
    if (evt.target.className === "lesson-1") {
	  var lesson1view = new Lesson1View({el: $("#lesson-holder")});
	  lesson1view.render();
	}
});
