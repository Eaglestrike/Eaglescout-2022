var utils = require('./utils');
var TBA = require('./TBA');

/********************
* Types of inputs *
- null (no input)
- dropdown [requires data]
- short_text
- long_text
- multiple_choice [requires data]
- checkbox [requires data]
- number 
- increment_number 
- slider [requires data]
********************/



var tableStructure = {
	team: {
		name: "<span class='no-mobile'>Team </span>#",
		data: "team"
	},
	more: {
		name: "More Info",
		data: {
			user: {
				name: "User",
				data: "user"
			},
			match: {
				name: "Match Number",
				data: "match"
			},
			auto_taxi: {
				name: "[Auto] Taxi",
				data: "auto_taxi"
			},
			auto_low_goals: {
				name: "[Auto] Low Goals Scored",
				data: "auto_low_goals"
			},
			auto_high_goals: {
				name: "[Auto] High Goals Scored",
				data: "auto_high_goals"
			},
			auto_comments: {
				name: "[Auto] Extra Comments",
				data: "auto_comments"
			},
			teleop_low_goals: {
				name: "[Teleop] Low Goals Scored",
				data: "teleop_low_goals"
			},
			teleop_high_goals: {
				name: "[Teleop] High Goals Scored",
				data: "teleop_high_goals"
			},
			teleop_eject_balls: {
				name: "[Teleop] Did they have a thing to eject wrong color balls?",
				data: "teleop_eject_balls"
			},
			teleop_shoot_balls: {
				name: "[Teleop] Where balls are shooted from",
				data: "teleop_shoot_balls"
			},
			teleop_robot_died: {
				name: "[Teleop] Robot died",
				data: "teleop_robot_died"
			},
			teleop_time_robot_died: {
				name: "[Teleop] How long robot was dead",
				data: "teleop_time_robot_died"
			},
			teleop_comments: {
				name: "[Teleop] Extra comments",
				data: "teleop_comments"
			},
			time_on_defense: {
				name: "[Defense] Percent of time on defense",
				data: "time_on_defense"
			},
			speed: {
				name: "[Bot] Speed compared to our robot",
				data: "speed"
			},
			endgame_climb: {
				name: "[Endgame] Climb",
				data: "endgame_climb"
			},
			endgame_climb_time: {
				name: "[Endgame] Climb time",
				data: "endgame_climb_time"
			},
			endgame_comments: {
				name: "[Endgame] Extra comments",
				data: "endgame_comments"
			},
			driver_skill: {
				name: "Driver Skill",
				data: "driver_skill"
			},
			final_comments: {
				name: "Final comments",
				data: "final_comments"
			}
		}
	}
}

var observationFormSchema = {
	user: {
		type: String,
		input: null
	},
	competition: {
		type: String,
		input: "dropdown",
		placeholder: "Select a competition",
		title: "Current competition",
		subtitle: "If you're at a practice match, select \"Practice Match\""
	},
	match: {
		type: String,
		input: "number",
		placeholder: "Match number only",
		title: "Match Number",
		subtitle: "This is the number of the match that you are observing"
	},
	team: {
		type: String,
		input: "number",
		placeholder: "Team number only",
		title: "Team Number",
		subtitle: "This is the team number that you are observing"
	},
	auto_taxi: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No"
		},
		placeholder: "Yes or No",
		title: "[Auto] Tarmac",
		subtitle: "Did they drive outside the tarmac?"

	},
	auto_low_goals: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Auto] Low goals scored",
		subtitle: "How many balls were successfully scored in the low goal during auto?"
	},
	auto_high_goals: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Auto] High goals scored",
		subtitle: "How many balls were successfully scored in the high/upper goals during auto?"
	},
	teleop_low_goals: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Low goals scored",
		subtitle: "How many balls were successfully scored in the low goal during teleop?"
	},
	teleop_high_goals: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] High goals scored",
		subtitle: "How many balls were successfully scored in the high goal during teleop?"
	},
	teleop_shot_accuracy: {
		type: String,
		input: "slider",
		data: {
			"min": 0,
			"max": 100
		},
		title: "[Teleop] Shot Accuracy",
		subtitle: "Approximate their shot accuracy as a percentage"
	},
	teleop_eject_balls: {
		type: String,
		input: "checkbox",
		placeholder: "Select all that apply",
		data: {
			"seperate_eject": "Yes, could eject with a seperate mechanism automatically",
			"shooting_eject_auto": "Yes, ejected with the shooter automatically",
			"shooting_eject_manual": "Yes, ejected with the shooter manually",
			"cannot_eject": "Fired wrong color balls in",
		},
		title: "[Teleop] Did they have a thing to eject wrong color balls?",
		subtitle: "Describe whether they could eject wrong color balls (automatically or manually) or if they fired the wrong colored balls in. If it's notable, expand more in the teleop comments.",
	},
	teleop_shoot_balls: {
		type: String,
		input: "checkbox",
		placeholder: "Select all that apply",
		data: {
			"launch_pad": "Completely within the Protected Zone / Launch Pad",
			"tarmac": "The Tarmac (Colored zone in front of the hub)",
			"terminal": "From the terminal",
			"wherever": "Litearlly wherever they want to",
			"one_position": "One set area they have to shoot from, elaborate in comments",
		},
		title: "[Teleop] Where balls are being shot from",
		subtitle: "Describe where the robot shot balls from. If it's notable, expand more in the teleop comments."
	},	
	teleop_robot_died: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No"
		},
		title: "[Teleop] Did the robot die?",
		subtitle: "If they did, note the time of death for the next question"
	},
	teleop_time_robot_died: {
		type: String,
		input: "number",
		placeholder: "Format: number of seconds only",
		title: "[Teleop] Amount of time that robot was dead",
		subtitle: "Max: 150. If the robot didn't die, leave this blank"
	},
	time_on_defense: {
		type: String,
		input: "slider",
		data: {
			"min": 0,
			"max": 100
		},
		title: "[Defense] Percent of time on defense",
		subtitle: "Approximate percent of time on defense"
	},
	speed: {
		type: String,
		input: "dropdown",
		data: {
			"slow": "Slow (lower than 8 ft/second)",
			"medium": "Medium (8 ft/second to 15 ft/second)",
			"fast": "Fast (greater than 15 ft/second)",
		},
		placeholder: "Select one",
		title: "[Bot] Speed compared to our robot (18 ft/second)",
		subtitle: "Approximate this if you can"
	},
	endgame_climb: {
		type: String,
		input: "dropdown",
		placeholder: "Select applicable",
		data: {
			"low_bar": "Successful low bar climb",
			"mid_bar": "Successful mid bar climb",
			"high_bar": "Successful high bar climb",
			"traverse_bar": "Successful traverse bar climb",
			"failed": "Attempted a climb but failed (elaborate which in comments, explain failure)",
			"no_attempt": "Did not attempt"
		},
		title: "[Endgame] Climbing",
		subtitle: "Carefully select all that apply"
	},
	endgame_climb_time: {
		type: String,
		input: "slider",
		data: {
			"min": 0,
			"max": 60
		},
		title: "[Endgame] Time to climb",
		subtitle: "Estimate the amount of time it took for robot to climb"
	},
	auto_comments: {
		type: String,
		input: "long_text",
		title: "[Auto] Extra comments",
		subtitle: "Anything noteworthy that occurred during the autonomous period"
	},
	teleop_comments: {
		type: String,
		input: "long_text",
		title: "[Teleop] Extra comments",
		subtitle: "Write anything that might be noteworthy about teleop here."
	},
	endgame_comments: {
		type: String,
		input: "long_text",
		title: "[Endgame] Any extra comments about the end of the game?",
		subtitle: "Put anything that would be noteworthy about the end of the game here."
	},
	driver_skill: {
		type: String,
		input: "slider",
		data: {
			"min": 1,
			"max": 5
		},
		title: "Driver Skill",
		subtitle: "On a scale from 1 (very bad) - 5 (very good), please rate how good the driving was"
	},
	final_comments: {
		type: String,
		input: "long_text",
		title: "Any extra comments about the game overall? (very important!)",
		subtitle: "Describe the driver skill, notable robot mechanisms/skills/flaws/behaviors, and anything else we should know as we try to imagine a robot."
	},
}

function getObservationFormStructure() {
	var form = {};
	for (var key in observationFormSchema) {
		if ("data" in observationFormSchema[key]) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder,
				data: observationFormSchema[key].data,
				title: observationFormSchema[key].title,
				subtitle: observationFormSchema[key].subtitle
			}
		} else if (observationFormSchema[key].input != null) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder,
				title: observationFormSchema[key].title,
				subtitle: observationFormSchema[key].subtitle
			}
		}
	}
	return form;
}

function getObservationFormSchema() {
	var schema = {};
	for (var key in observationFormSchema) {
		schema[key] = {
			type: observationFormSchema[key].type

		};
	}
	return schema;
}

function getObservationFormHandlebarsHelper(structure, options) {
	var id = 0;

	var finalString = '<form method="post" action="/scout/new">\n<div class="container">\n<div class="row">';
	for (var category in structure) {
		if (category == "events") continue;
		finalString += '<p>';
		finalString += '<b>' + structure[category].title + '</b>\n<br>\n' + structure[category].subtitle + '\n';
		finalString += '</p>';
		if (category == "competition") {
			finalString += '<select name="competition">\n';
			finalString += '<option value="" disabled ' + (utils.getCurrentEvent() == null ? 'selected' : '') + '>Choose event from list</option>\n';
			for (var event in structure.events) {
				finalString += '<option value="' + structure.events[event]["key"] + '"' + (structure.events[event]["current"] ? ' selected' : '') + '>' + structure.events[event]["name"] + '</option>\n';
			}
			finalString += '</select>\n';
		} else {
			if (structure[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '">' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "multiple_choice") {
				for (var option in structure[category].data) {
					finalString += '<p>\n';
      				finalString += '<input class="with-gap" name="' + category + '" value="' + option + '" type="radio" id="' + option + '_' + id + '" />\n';
      				finalString += '<label for="' + option + '_' + (id ++) + '">' + (structure[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (structure[category].input == "long_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<textarea name="' + category + '" class="materialize-textarea"></textarea>\n';
          		finalString += '<label for="' + category + '">Message</label>\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "short_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<input placeholder="' + structure[category].placeholder + '" name="' + category + '" type="text">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "checkbox") {
				finalString += '<select name="' + category + '" multiple>\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '">' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "number") {
				finalString += '<div class="input-field">\n';
				finalString += '<input class="validate" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "increment_number") {
				finalString += '<div class="input-field row">\n';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_minus_button col s2" data-for="' + category + '">-</a>';
				finalString += '<div class="col s1"></div>';
				finalString += '<input class="validate increment_number col s6" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="0">\n';
				finalString += '<div class="col s1"></div>';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_plus_button col s2" data-for="' + category + '">+</a>';
          		finalString += '</div>\n';
			} else if (structure[category].input == "slider") {
				finalString += '<p class="range-field">';
			    finalString += '<input type="range" name="' + category + '" min="' + (structure[category].data)["min"] + '" max="' + (structure[category].data)["max"] + '" />';
			    finalString += '</p>';
			}
		}
		finalString += '<br>';
	}
	finalString += '</div>\n</div>\n<div class="center">\n<button class="btn waves-effect waves-light green" type="submit" name="action">Submit</button>\n</div>\n</form>';
	return finalString;
}

function getEditObservationHandlebarsHelper(observation, structure, observationID, options) {
	var id = 0;

	var finalString = '<form method="post" action="/scout/saveobservation/' + observationID + '">\n<div class="container">\n<div class="row">';
	for (var category in structure) {
		if (category == "events") continue;
		finalString += '<p>';
		finalString += '<b>' + structure[category].title + '</b>\n<br>\n' + structure[category].subtitle + '\n';
		finalString += '</p>';
		if (category == "competition") {
			finalString += '<select name="competition">\n';
			finalString += '<option value="" disabled ' + (utils.getCurrentEvent() == null ? 'selected' : '') + '>Choose event from list</option>\n';
			for (var event in structure.events) {
				finalString += '<option value="' + structure.events[event]["key"] + '"' + (structure.events[event]["key"] == observation[category] ? ' selected' : '') + '>' + structure.events[event]["name"] + '</option>\n';
			}
			finalString += '</select>\n';
		} else {
			if (structure[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '"' + (option == observation[category] ? ' selected' : '') + '>' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "multiple_choice") {
				for (var option in structure[category].data) {
					finalString += '<p>\n';
      				finalString += '<input class="with-gap" name="' + category + '" value="' + option + '" type="radio" id="' + option + '_' + id + '"' + (option == observation[category] ? ' checked' : '') + ' />\n';
      				finalString += '<label for="' + option + '_' + (id ++) + '">' + (structure[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (structure[category].input == "long_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<textarea name="' + category + '" class="materialize-textarea">' + observation[category] + '</textarea>\n';
          		finalString += '<label for="' + category + '">Message</label>\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "short_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<input placeholder="' + structure[category].placeholder + '" name="' + category + '" type="text" value="' + observation[category] + '">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "checkbox") {
				finalString += '<select name="' + category + '" multiple>\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '"' + (observation[category] !== undefined && observation[category].split(",").includes(option) ? ' selected' : '') + '>' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "number") {
				finalString += '<div class="input-field">\n';
				finalString += '<input class="validate" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="' + observation[category] + '">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "increment_number") {
				finalString += '<div class="input-field row">\n';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_minus_button col s2" data-for="' + category + '">-</a>';
				finalString += '<div class="col s1"></div>';
				finalString += '<input class="validate increment_number col s6" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="' + observation[category] + '">\n';
				finalString += '<div class="col s1"></div>';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_plus_button col s2" data-for="' + category + '">+</a>';
          		finalString += '</div>\n';
			} else if (structure[category].input == "slider") {
				finalString += '<p class="range-field">';
			    finalString += '<input type="range" name="' + category + '" min="' + (structure[category].data)["min"] + '" max="' + (structure[category].data)["max"] + '" value="' + observation[category] + '" />';
			    finalString += '</p>';
			}
		}
		finalString += '<br>';
	}
	finalString += '</div>\n</div>\n<div class="center">\n<button class="btn waves-effect waves-light green" type="submit" name="action">Submit</button>\n</div>\n</form>';
	return finalString;
}

function getTeamSummaryHandlebarsHelper(teamAverage, teamCapabilities, img, options){
	var finalString = "";	
	finalString+="<h2 class= 'med-text blue-text text-darken-4'> Observed Robot Capabilities: </h2>";
	finalString += "<table>\n<thead>"
	finalString += "<th class='no-padding'>Category</th>\n"
	finalString += "<th class='no-padding'>Maximum</th>\n"
	finalString += "</thead>\n"
	for(var category in teamCapabilities){
		finalString+="<tr class='no-padding alternate-colors'><td class='no-padding'>";
			if(category=='teleop_robot_died'){
			finalString+="<b>Games Robot Has Died</b></td><td class='no-padding'>";
			finalString+='Matches (' + teamCapabilities[category]+")</td></tr>"
			continue;
		}
		if(category=='time_on_defense'){
			finalString+="<b>[Defense] Defense Games Played</b></td><td class='no-padding'>";
			finalString+='Matches (' + teamCapabilities[category]+")</td></tr>"
			continue;
		}
		if(tableStructure["more"]["data"][category] == undefined) continue;
		finalString+="<b>"+tableStructure["more"]["data"][category]["name"] + "</b></td><td class='no-padding'>";
		if(typeof teamCapabilities[category] === 'object'){
			var arr = [];
			for(var obs in teamCapabilities[category]){
				arr.push(observationFormSchema[category]["data"][teamCapabilities[category][obs]]);
			}
			var arrStr = arr.join(', ');
			finalString += arrStr;
			continue;
		}
		if(typeof teamCapabilities[category] === 'string'){
			finalString += observationFormSchema[category]["data"][teamCapabilities[category]];
			continue;
		}
		finalString+=teamCapabilities[category]+"</td></tr>";
	}
	
	finalString += "</table></br>";
	finalString += "<div><div id='col-small-table'><h2 class= 'med-text blue-text text-darken-4'> Average Points Generated: </h2>";
	finalString += "<table class='small-table'>\n<thead>"
	finalString += "<th class='no-padding'>Category</th>\n"
	finalString += "<th class='no-padding'>Points</th>\n"
	finalString += "</thead>\n"
	for(var category in teamAverage){
		finalString+="<tr class='no-padding alternate-colors'><td class='no-padding'>";
		var points = Math.floor(teamAverage[category]*100)/100;
		if(category=='points_generated'){
			finalString+="<b>Average Points Per Game</b></td><td class='no-padding'>";
			finalString+=points+"</td></tr>"
			continue;
		}
		if(tableStructure["more"]["data"][category] == undefined) continue;
		finalString+="<b>"+tableStructure["more"]["data"][category]["name"] + "</b></td><td class='no-padding'>";
		finalString+=points+"</td></tr>";
	}
	finalString+="</table></div>";
	if(img != undefined){
		finalString+="<div id='col-robot-picture' class='no-mobile'><h2 class='med-text blue-text text-darken-4'> Picture: </h2>";
		finalString+="<a href='" + img + "' target='_blank'><img src='" + img + "' style='height: 200px'></img></a></div></div>"
	}
	return finalString;

}
function getTableHandlebarsHelper(structure, res, options) {
	var finalString = "";

	finalString+="<table class='bordered'>\n<thead>\n";
	for (var category in tableStructure) finalString += "<th>" + tableStructure[category]["name"] + "</th>\n";
	finalString += "<th class='no-mobile'>Edit</th>\n";
	finalString += "<th class='no-mobile'>Delete</th>\n";
	finalString += "</thead>\n";
	for (var observation in structure) {
		finalString += "<tr>";
		if(structure[observation]['team'] == undefined) continue;
		for (var category in tableStructure) {
			var data = tableStructure[category]["data"];
			if (typeof data == 'object') {
				finalString += "<td>";
				for (var subcategory in data) {
					var data_subcategory = tableStructure[category]["data"][subcategory]["data"];
					var display = structure[observation][data_subcategory];
					if (display == null || display == "" || display == "undefined" || display == "NaN") continue;
					if (observationFormSchema[subcategory]["input"] == "checkbox") {
						var selectedChecks = display.split(",");
						var checkboxFinalString = "";
						for (var item in selectedChecks) {
							checkboxFinalString += observationFormSchema[subcategory]["data"][selectedChecks[item]] + ", ";
						}
						checkboxFinalString = checkboxFinalString.substring(0, checkboxFinalString.length - 2);
						display = checkboxFinalString;
					} else if ("data" in observationFormSchema[subcategory] && observationFormSchema[subcategory]["input"] !== "slider") {
						display = observationFormSchema[subcategory]["data"][display];
					}
					finalString += "<b>" + tableStructure[category]["data"][subcategory]["name"] + ": </b>" + display + "</b><br>";
				}
				finalString += "</td>";
			} else if (category == "team") {
				finalString += "<td><a href='/scout/list/" + structure[observation][data] + "'><b class='med-text'>" + structure[observation][data] + "</b></a><br>";
				finalString +="<a class='mobile-only " + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='/scout/editobservation/" + structure[observation]["_id"] + "'>Edit <br></a>"
				finalString += "<a class='mobile-only modal-trigger open-modal" + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='#confirm-delete-modal' data-id='" + structure[observation]["_id"] + "'>Delete</a></td>";
			} else {
				finalString += "<td>" + structure[observation][data] + "</td>";
			}
		}
		finalString += "<td class='no-mobile'><a class='waves-effect waves-light btn-large light-blue" + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='/scout/editobservation/" + structure[observation]["_id"] + "'><i class='material-icons'>create</i></a></td>";
		finalString += "<td class='no-mobile'><a class='waves-effect waves-light btn-large red modal-trigger open-modal" + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='#confirm-delete-modal' data-id='" + structure[observation]["_id"] + "'><i class='material-icons'>delete</i></a></td>";
		finalString += "</tr>";
	}
	finalString += "</table>";
	return finalString;
}


function getRankingHandlebarsHelper(structure, filter, options) {
	var finalString = "<table class='bordered'>\n<thead>\n";
	finalString += "<th class='stickyy'>Place</th>\n";
	rankingStructure = ['place'];
	if(structure.length == 0) return;
	for (var category in structure[0]) {
		if (category==filter || category=='team') 
			finalString += "<th class='stickyy'>" + category[0].toUpperCase() + category.slice(1) + "</th>\n";
		else{
			finalString += "<th class='no-mobile stickyy'>" + category[0].toUpperCase() + category.slice(1) + "</th>\n";
		}
		rankingStructure.push(category);
	}
	finalString += "</thead>\n";

	for (var observation in structure) {
		finalString += "<tr class='alternate-colors'>";
		for (var category in rankingStructure) {
			var data = rankingStructure[category];
			if (data == "place") {
				finalString += "<td><b>" + (parseInt(observation) + 1) + "</b></td>";
			} else if (data == "team") {
				finalString += "<td><b><a href='/scout/list/" + structure[observation][data] + "'>" + structure[observation][data] + "</a></b></td>";
				continue;
			} else {
				if (filter == data) 
					finalString += "<td>" + structure[observation][data] + "</td>";
				else{
					finalString += "<td class='no-mobile'>" + structure[observation][data] + "</td>";
				}
			}
		}
		finalString += "</tr>";
	}
	finalString += "</table>";
	return finalString;
}

module.exports = {
	getTeamSummaryHandlebarsHelper: getTeamSummaryHandlebarsHelper,
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
	getObservationFormHandlebarsHelper: getObservationFormHandlebarsHelper,
	getEditObservationHandlebarsHelper: getEditObservationHandlebarsHelper,
	getTableHandlebarsHelper: getTableHandlebarsHelper,
	getRankingHandlebarsHelper: getRankingHandlebarsHelper
};
