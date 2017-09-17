//bring in our scrape script and makeDate scripts
var scrape = require('../scripts/scrape');
var makeDate = require('../scripts/date');

//bring in the Headline and Note mongoose models
var Headline = require('../models/Headline');

module.exports = {
	//fetch runs the scrape function that grabs all the articles and insert them into the Headline.collection in our mongo database
	
	
	//when we run fetch, we run a function, pass cb into that function...
	fetch: function(cb) {
		//then, run scrape: set the data to be called articles and 
		scrape(function(data) {
			var articles = data;
			for (var i=0; i < articles.length; i++) {
				//run through each article and run the makeDate() to insert the date
				articles[i].date = makeDate();
				//and set saved to false on all of them
				articles[i].saved = false;
			}
			//then run this *mongo* function, taking Headline and *insert* lots of diff articles into Mongo collection	
			Headline.collection.insertMany(articles, {ordered: false}, function (err, docs) {
				//if one article fails, it doesn't throw the error and stop the process,
				//it skips it and keeps going until we're done. the cb will return any err we get in the docs
				cb(err, docs);
			});
		});
	},

	//delete function to remove articles
	delete: function(query, cb) {
		Headline.remove(query, cb);
	},
	//get function to get all of the items in the collection out
	get: function(query, cb) {
		//find all headlines in the query
		Headline.find(query)
		//sort them most recent to least recent
		.sort({
			_id: -1
		})
		//once done, pass all those documents to our cb function
		.exec(function(err, doc) {
			cb(doc);
		})
	},

	//this updates any new articles that are scraped with the relevant id and update any information
	//that's passed to those articles with that information as well
	update: function(query, cb) {
		Headline.update({_id: query._id}, {
			$set: query
		}, {}, cb);

	}
}

