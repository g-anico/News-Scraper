var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//this is our schema or model for our Headlines
var headlineSchema = new Schema({
	headline: {
		type: String,
		required: true,
		unique: true
	},
	summary: {
		type: String,
		required: true
	},
	date: String,
	saved: {
		type: Boolean,
		default: false
	}
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;