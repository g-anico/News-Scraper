//scrape script

//require request and cheerio, to do our scraping
var request = require('request');
var cheerio = require('cheerio');

//cheerio traverses through the webpage to do our scraping

var scrape = function(cb) {
	request("http://www.nytimes.com", function(err, res, body) {
		var $ = cheerio.load(body);
		var articles = [];
		$(".theme-summary").each(function(i, element) {
			//grabs the text from story-heading and removes whitespace, set it to variable "head"
			//does the same with summary
			var head = $(this).children(".story-heading").text().trim();
			var sum = $(this).children(".summary").text().trim();

			//if head and sum exists, meaning scraper was able to get text from both,
			//replace with reg ex, which just cleans up whitespace	
			if(head && sum) {

				var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
				var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
				//make an object out of our sumNeat and headNeat and gives it properties
				//headline and summary that are required to create an article in our model	
				var dataToAdd = {
					headline: headHeat,
					summary: sumNeat
				};
				//then push our new dataToAdd and keep going thru every .theme-summary in the array until are done
				articles.push(dataToAdd);

			}

		});
		//once we are done, the cb function sends us articles
		cb(articles);
	});
	
}
//export scrape so we can use it throughout our application
module.exports = scrape; 





