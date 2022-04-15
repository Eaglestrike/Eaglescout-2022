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
		type: Number,
		input: "number",
		placeholder: "Match number only",
		title: "Match Number",
		subtitle: "This is the number of the match that you are observing"
	},
	team: {
		type: Number,
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
		type: Number,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Auto] Low goals scored",
		subtitle: "How many balls were successfully scored in the low goal during auto?"
	},
	auto_high_goals: {
		type: Number,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Auto] High goals scored",
		subtitle: "How many balls were successfully scored in the high/upper goals during auto?"
	},
	auto_comments: {
		type: String,
		input: "long_text",
		title: "[Auto] Extra comments",
		subtitle: "Anything noteworthy that occurred during the autonomous period"
	},
	teleop_low_goals: {
		type: Number,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Low goals scored",
		subtitle: "How many balls were successfully scored in the low goal during teleop?"
	},
	teleop_high_goals: {
		type: Number,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] High goals scored",
		subtitle: "How many balls were successfully scored in the high goal during teleop?"
	},
	teleop_eject_balls: {
		type: Array,
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
		type: Array,
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
		type: Number,
		input: "number",
		placeholder: "Format: number of seconds only",
		title: "[Teleop] Amount of time that robot was dead",
		subtitle: "Max: 150. If the robot didn't die, leave this blank"
	},
	teleop_comments: {
		type: String,
		input: "long_text",
		title: "[Teleop] Extra comments",
		subtitle: "Write anything that might be noteworthy about teleop here."
	},
	time_on_defense: {
		type: Number,
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
		type: Number,
		input: "slider",
		data: {
			"min": 0,
			"max": 60
		},
		title: "[Endgame] Time to climb",
		subtitle: "Estimate the amount of time it took for robot to climb"
	},
	endgame_comments: {
		type: String,
		input: "long_text",
		title: "[Endgame] Any extra comments about the end of the game?",
		subtitle: "Put anything that would be noteworthy about the end of the game here."
	},
	driver_skill: {
		type: Number,
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

const getObservationFormStructure = ()=> {
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

const getObservationFormSchema = () => {
	var schema = {};
	for (var key in observationFormSchema) {
		schema[key] = {
			type: observationFormSchema[key].type

		};
	}
	return schema;
}

module.exports = {
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
};
