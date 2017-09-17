// first we say, don't run any JavaScript. Just load my HTML and CSS first
$(document).ready(function() {
	//set a reference to the article-container div where all the dynamic content will go
	var articleContainer = $(".article-container");
	//add event listeners to any dynamically generated "save article"
	$(document).on("click", ".btn.save", handleArticleSave);
	//and "scrape new article" buttons
	$(document).on("click", ".scrape-new", handleArticleScrape);

	//once the page is ready, run a function, "", to kick things off

	initPage();

	function initPage() {
		//first we empty the article container, run an AJAX req for any unsaved headlines
		articleContainer.empty();
		//if the user has not sent the headlines to the saved articles section
		$.get("/api/headlines?saved=false")
		.then(function(data) {
			//if we have headlines, render them to the page
			if (data && data.length) {
				renderArticles(data);
			}
			//otherwise show message explaining we have no articles
			else {
				renderEmpty();
			}
		});
	}

	function renderArticles(articles) {
		//this function handles appending HTML containig article data to the page
		//we are passed an array of JSON container all avail articles in our db

		var articlePanels = [];
		//we pass each article JSON object to the createPanel function which returns a bootstrap panel w our article data inside
		for (var i = 0; i < articles.length; i++) {
			articlePanels.push(createPanel(articles[i]));
		}

		//once we have all the HTML for the articles stored in our articlesPanels array,
		//append them to the articlePanels container
		articleContainer.append(articlePanels);

	}

	function createPanel(article){
		// when we create a panel, we are just creating a var panel,
		//and inserting some bootstrap styling and inserting the article headline w a button that
		//allows you to see the article 
		var panel = 
		$(["<div class='panel panel-default'>",
			"<div class='panel-heading'>",
			"<h3>",
			article.headline,
			"<a class='btn btn-success save'>",
			"Save Article",
			"</a>",
			"<h3>",
			"<div>",
			//next it will put the article in the panel body and assoc the panel data ID with the article ID
			//so that when they click 'save article' we know which one they want to save
			"<div class='panel-body'>",
			article.summary,
			"</div>",
			"</div>"
			].join("")
			);
		panel.data("_id", article._id);
		return panel;
	}

	function renderEmpty() {
		//this function renders some HTML to the page explaining we don't have any articles to view
		//using .join to join array of HTML string data bc easier to read/change than concat string
		var emptyAlert = 
		$(["<div class='alert alert-warning text-center'>",
			"<h4>Uh oh, looks like we don't have any new articles.</h4>",
			"</div>",

			"<div class='panel panel-default'>",
			"<div class='panel-heading text-center'>",
			"<h4>What would you like to do?</h4>",
			"</div>",
			"<div class='panel-body text-center'>",
			"<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
			"<h4><a href='/saved'>Go to Saved Articles</a></h4>",
			"</div>",
			"</div>"
			].join("")
			);
		//append this data to the page
		articleContainer.append(emptyAlert);

	}

	function handleArticleSave() {
		//this function is triggered when the user wants to save an article
		//.data method allows us to attach data of any type to DOM elements
		var articleToSave = $(this).parents(".panel").data();
		articleToSave.saved = true;

		//then run the AJAX method against patch on that URL API headlines and we changed the data to articleToSave
		$.ajax({
			method: "PUT",
			url: "/api/headlines",
			data: articleToSave
		})
		//if the data is ok, which means if it is true, if it exists, run the initPage function again. 
		//this is going to reload all the articles but remove the one the user has saved so they can't save it anymore bc it's already
		//inside their saved articles section
		
		.then(function(data) {
			if (data.ok) {
				initPage();
			}
		});
	}

	//this function handles the user clicking any 'scrape new article buttons'
	function handleArticleScrape() {
		$.get("/api/fetch")
		.then(function(data) {
			//run initPage again so we can re render the articles to the apge and let the user know how many unique articles we saved
			initPage();
			bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
		});
	}

});