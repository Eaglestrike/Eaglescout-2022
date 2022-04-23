const fs = require('fs');
module.exports = {

	getCurrentEvent: async () => {
		var buffer = await fs.readFileSync("../config/state.json", "utf-8")
		var json = JSON.parse(buffer);
		return json["current_event"];
	},
    getCurrentGame: async () => {
		var buffer = await fs.readFile("../config/state.json", "utf-8")
		var json = JSON.parse(buffer);
		return json["current_game"];
    },
	genConfirmationCode: (len) => {
		var letters="0123456789abcdefghijklmnopqrstuvwxyz"
		var code = "";
		for(var i = 0; i < len; i++){
			code += String.fromCharCode(letters[Math.floor(Math.random()*36)])
		}
		return code;
	}
};


