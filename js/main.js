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
var headerData = { header: [{ title: "Teach Me Korean!!", content:"Learn Korean by starting off with simple sentences with mouseovers for each word, and learn to combine words together to create proper sentences and structures.", details: "Learn more &raquo;" }]
};
var Lesson1Data = { lesson: [{ english : "Hello", korean: "안녕하세요", romanized: "ann-nyeong-ha-se-yo"}, { english : "Thank you", korean: "감사합니다", romanized: "kam-sa-hap-ni-da" }] };
var Lesson2Data = { lesson: [{ english: "Yes", korean: "네", romanized: "ne" },
                             { english: "No", korean: "아니요", romanized: "an-ni-yo" }] };
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