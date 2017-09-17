//create a variable that makes a Date

var makeDate = function() {
	var d = new Date();
	var formattedDate = "";
	//getMonth, getDate, getFullYear..all these are built-in JavaScript functions.
	//we +1 to getMonth because it counts months at a 0 index. Jan shows up as 0, Feb as 1, etc.
	//so we add 1 to the number so it can be the date that we would use it as
	
	formattedDate += (d.getMonth() + 1) + "_";
	
	formattedDate += d.getDate()  + "_";
	
	formattedDate += d.getFullYear();
	
	return formattedDate;
};
//then export the date for use throughout the program
module.exports = makeDate;