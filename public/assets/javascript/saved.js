$(document).ready(function() {
	var articleContainer = $(".article-container");

	$(document).on("click", ".btn.delete", handleArticleDelete);
	$(document).on("click", ".btn.notes", handleArticleNotes);
	$(document).on("click", ".btn.save", handleNoteSave);
	$(document).on("click", ".btn.note-delete", handleNoteDelete);

	initPage();

	function initPage() {
		//first we empty the article container, run an AJAX req for any unsaved headlines
		articleContainer.empty();
		//this looks for headlines that have a saved value of true
		$.get("/api/headlines?saved=true")
		.then(function(data) {
			//it wants to render all the articles to the page
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
			].join(""));

		//we attach the article's id to the jquery element
		//we will use this when trying to figure out which article the user wants to remove or open notes for
		panel.data("_id", article._id);
		//return the constructed panel jQuery element
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
			"<h3>What would you like to do?</h3>",
			"</div>",
			"<div class='panel-body text-center'>",
			"<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
			"<h4><a href='/saved'>Go to Saved Articles</a></h4>",
			"</div>",
			"</div>"
			].join(""));
		//append this data to the page
		articleContainer.append(emptyAlert);

	}

	function renderNotesList() {
		//this function handles rendering note list items to our notes modal
		//set up an array of notes to render after finished
		//set up a currentNote var to temporarily store each ntoe
		var notesToRender = [];
		var currentNote;
		if(!data.notes.length) {
			//if we have no notes, display a message explaining this
			currentNote = [
			"<li class='list-group-item'>",
			"No notes for this article.",
			"</li>"
			].join("");
			notesToRender.push(currentNote);
		}
		else {
			//if we have notes, go through each one
			for (var i = 0; i < data.notes.length; i++) {
				//construct a list element to contain our noteText and a delete btn
				currentNote = $([
					"<li class='list-group-item note'>",
					data.notes[i].noteText,
					"<button class='btn btn-danger note-delete'>x</button>",
					"</li>"
				].join(""));
				//store the note id on the delete btn for easy access when trying to delete
				currentNote.children("button").data("_id", data.notes[i]._id);
				//adding our currentNote to the notesToRender array
				notesToRender.push(currentNote);	
			}
		}
		//now append the notesToRender to the note-container inside the note modal
		$(".note-container").append(notesToRender);
	}

function handleArticleDelete() {
	//this function deletes articles/headlines
	//grab the id of the article to delete from the panel element that the delete button sits inside
	var articleToDelete =$(this).parents(".panel").data();
	//using a delete method 
	$.ajax({
		method: "DELETE",
		url: "/api/headlines" + articleToDelete._id
	}).then(function(data) {
		//if this works out, run initPage to rerender list of saved articles
		if (data.ok) {
			initPage();
		}
	});
}

function handleArticleNotes() {
	//create a variable 'currentArticle' that will include the panel that the user is clicking on in relation to the notes
	var currentArticle = $(this).parents(".panel").data();
	//then it grabs all the notes attached to the current article ID and create a modal that displays all of that
	$.get("/api/notes" + currentArticle._id.then(function(data) {
		//construct our initial HTML to add to the notes modal
		var modalText = [
		"<div class='container-fluid text-]'>",
		"<h4>Notes for Article: ",
		currentArticle._id,
		"</h4>",
		"<hr />",
		"ul class='list-group note-container'>",
		"</ul>",
		"<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
		"<button class='btn btn-success save'>Save Note</button>",
		"</div>"
		].join("");
		//next it will create a dialog with the modal that will allow them to close the modal and show the note data assoc w that article
		bootbox.dialog({
			message: modalText,
			closeButton: true
		});

		var noteData = {
			_id: currentArticle._id,
			notes: data || []
		};
		//add some info about the article and article notes to the save button for easy access
		//when trying to add a new note
		$(".btn.save").data("article", noteData);
		//renderNotesList will populate the actual note HTML inside the modal we just created
		renderNotesList(noteData);
	}))
}

function handleNoteSave() {
	//this function handles what happends when a user tries to save a new note for an article
	//set the var to hold some formatted data about our note; grab the note typed into the input box

	var noteData;
	var newNote = $(".bootbox-body textarea").val().trim();
	//if we have data typed into the note input field, format it and post it to the '/api/notes route'
	//and send the formatted noteData as well

	if (newNote) {
		//if newNote is true, it will assoc the article id as the ID for that note and it
		//it will assoc the noteText with the newNote. this is semantic
		noteData = {
			_id: $(this).data("article")._id,
			noteText: newNote
		};
		//then it will post to the api route notes and send the note data as the request and once complete, will close the modal

		$.post("/api/notes", noteData).then(function() {
			//when complete, close the modal
			bootbox.hideAll();
		});
	}
}
//function to handle deletion of notes
function handleNoteDelete() {
	//first grab the id of the note we want to delete. we stored this data on the delete button when we created it
	//
	var noteToDelete = $(this).data("_id");

	//perform a delete request to "/api/notes" with the id of the note we're deleting as a param
	$.ajax({
		url: "/api/notes" + noteToDelete,
		method: "DELETE"
	}).then(function() {
		//when done, hide modal
		bootbox.hideAll();
	});
}

});
