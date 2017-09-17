var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//this is our schema or model  for our Notes
var noteSchema = new Schema({
	_headlineId: {
		type: Schema.Types.ObjectId,
		ref: "Headline"
	},
	date: String,
	noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;