//require our dependencies

var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//set up our port
var PORT = process.env.PORT || 3000;
//instantiate our express app
var app = express();
//set up an express router
var router = express.Router();
//require our routes file pass our router object
require('./config/routes')(router);


//designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//step 3: include express-handlebars. connect handlebars to our express app.


app.engine("handlebars", expressHandlebars({
	defaultLayout: "main"
}));
//since we set our view engine to handlebars, the routes.js file knows to look for files with .handlebars
app.set("view engine", "handlebars");

//step 2: set up bodyParser in our app
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(router);

//step 4. set up mongoose db
//if deployed, use the deployed db; otherwise use the local mongoHeadlines db
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//connect mongoose to our database
mongoose.connect(db, { useMongoClient: true}, function(error) {
	//if there's an error, tell us there's an error
	if(error) {
		console.log(error);
	}
	//otherwise, log a success message
	else {
		console.log("mongoose connection successful");
	}
});


//listen on the port
app.listen(PORT, function() {
	console.log("Listening on port: " + PORT);
});
