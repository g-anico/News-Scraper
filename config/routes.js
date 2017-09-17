//server routes

//bring in scrape function from our scripts directory

var scrape = require('../scripts/scrape');

//bring in headlines and notes from the controller
var headlinesController = require('../controllers/headlines');
var notesController = require('../controllers/notes');

module.exports = function(router) {
	//this route renders the homepage
	//since we set our view engine to handlebars, it knows to look for .handlebars
	router.get("/", function(req, res) {
		res.render("home");
	});

	//this route renders the saved handlebars page
	//the req in the callback function below is from the fetch function from the headlines.js file
	router.get("/saved", function(req, res) {
		res.render("saved");
	});

	router.get("/api/fetch", function(req, res) {
		headlinesController.fetch(function(err, docs) {
			if (!docs || docs.insertedCount === 0) {
				res.json({
					message: "No new articles today. Slow news day. Check back tomorrow!"
				});
			}
			else {
				res.json({
					message: "Added " + docs.insertedCount + " new articles!"
				});
			}
		});
	});
	//when the router hits api headlines, take request and respond appropriately. 
	//the user's request is defined by query. if the user doesnt specify, then it will return everything
	router.get("/api/headlines", function(req, res) {
		//at first, the query is empty. if the query doesn't specify anything, it returns everything in res.json
		var query = {};
		//if user specifies a saved article or specific parameter, it's going to set the query to that
		if (req.query.saved) {
			query = req.query;
		}

		headlinesController.get(query, function(data) {
			res.json(data);
		});

	});
	//a route to handle deleting a specific article
	router.delete("/api/headlines/:id", function(req, res) {
		var query = {};
		query._id = req.params.id;
		headlinesController.delete(query, function(err, data) {
			res.json(data);
		});
	});
	//run the headlinesController.update function on whatever the user sends in their request

	router.patch("/api/headlines", function(req, res) {
		headlinesController.update(req.body, function(err, data) {
			res.json(data);
		});
	});
	
	//a function that grabs all the notes associated with an article so we can display it to the user
	router.get("/api/notes/:headline_id?", function(req, res) {
		//first set the query to nothing, but..
		var query = {};
		//if the parameters that the user sets exists; if that is true,
		//then, set the query id to equal the param they set.
		if (req.params.headline_id) {
			query._id = req.params.headline_id;
		}
		//then use the get function on the notesController, pass in that query for that specific param,
		//and return the data associated with that, in json format, so we can use on the front-end
		notesController.get(query, function(err, data) {
			res.json(data)

		});
	});

	//now we need a route to delete our notes
	router.delete("/api/notes/:id", function(req, res) {
		var query = {};
		query._id = req.params.id;
		notesController.delete(query, function(err, data) {
			res.json(data);
		});
	});

	router.post("/api/notes", function(req, res) {
		notesController.save(req.body, function(data) {
			res.json(data);
		});
	});
}
//We're done with our routes!


