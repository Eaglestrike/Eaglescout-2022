const fs = require('fs');
const getCurrentEvent = async () => {
	var buffer = await fs.readFileSync("../config/state.json", "utf-8")
	var json = JSON.parse(buffer);
	return json["current_event"];
}
const getCurrentGame = async () => {
	var buffer = await fs.readFile("../config/state.json", "utf-8")
	var json = JSON.parse(buffer);
	return json["current_game"];
}
const genConfirmationCode = (len) => {
	var letters="0123456789abcdefghijklmnopqrstuvwxyz"
	var code = "";
	for(var i = 0; i < len; i++){
		code += String.fromCharCode(letters[Math.floor(Math.random()*36)])
	}
	return code;
}
const readMatchString = (matchString) => {
	/*
	TBA match key with the format yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]t[TEAN_NUMBER],
	 where yyyy is the year, and EVENT_CODE is the event code of the event,
	 COMP_LEVEL is (qm, ef, qf, sf, f), and MATCH_NUMBER is the match number 
	 in the competition level. A set number may be appended to the competition
	 level if more than one match in required per set. */
	var match = {};
	try {
		var year = parseInt(matchString.substring(0,4));
		var temp1 = matchString.substring(4).split('_')
		var event = temp1[0];
		var temp2 = temp1.split('m')
		var compLevel = temp2[0]
		var match = parseInt(temp2[1].split('t')[0])
		var team = parseInt(temp2[1].split('t')[1])
		return {
			year: year,
			event: event,
			compLevel: compLevel,
			match: match,
			team: team
		}
	}
	catch(err) {
		return null;
	}

}
module.exports = {
	getCurrentEvent,
	getCurrentGame,
	genConfirmationCode,
	readMatchString,
};


