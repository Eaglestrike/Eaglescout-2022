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
		code += letters[Math.floor(Math.random()*36)]
	}
	return code;
}
const readMatchString = (matchString) => {
	/*
	TBA match key with the format [GAME_CODE]_[EVENT_CODE]_[COMP_LEVEL]_[MATCH_NUMBER]_[TEAM_NUMBER],
	 where GAME_CODE is the game you are playing, and EVENT_CODE is the event code of the event,
	 COMP_LEVEL is (qm, ef, qf, sf, f), and MATCH_NUMBER is the match number 
	 in the competition level. A set number may be appended to the competition
	 level if more than one match in required per set. */
	var match = {};
	try {
		var split = matchString.split('_')
		var game = split[0];
		var event = split[1];
		var compLevel = split[2]
		var match = parseInt(split[3])
		var team = split[4]
		return {
			game: game,
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


