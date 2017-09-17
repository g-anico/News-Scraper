//controller for our notes

var Note = require('../models/Note');
var makeDate = require('../scripts/date');

module.exports = {
	//get function that will grab all the notes that are associated with the articles
	//important to note that we do not run a fetch function herebecause we're not scraping note data
	//the notes are all created by our users.

	//our get function will find all of the notes associated with our headlineId 
	get: function(data, cb) {
		Note.find({
			_headlineId: data._id
		}, cb);
	}, 
	//our save function takes in data from our user and a callback function
	save: function(data, cb) {
		//first we create an object, newNote, which will have the headlineId associated with the note being created,
		//the date the note is created and
		var newNote = {
			_headlineId: data._id,
			date: makeDate(),

			//noteText is what the user types in
			noteText: data.noteText
		};
		//next we will create the note from the newNote above
		Note.create(newNote, function (err, doc) {
			if(err) {
				console.log(err);
			}
			else {
				console.log(doc);
				cb(doc);
			}
		});
	},

	//delete function so people can delete the note 
	//remove the note associated with that article
	delete: function (data, cb) {
		Note.remove({
			_id: data._id
		}, cb);
	}

};