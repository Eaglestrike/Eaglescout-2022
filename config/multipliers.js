module.exports = {

	/*
	(dictionary): key is observation value, value is value
	number: takes a number and parses it
	num-yes: takes a number and returns 1 if it is greater than 0
	*/
	structure: {
		'games_played': 0,	
		'auto_taxi': {'yes': 1, 'no': 0},
		'auto_low_goals': 'number',
		'auto_high_goals': 'number',
		'teleop_low_goals': 'number',
		'teleop_high_goals': 'number',
		'speed': {'slow': -1, 'medium': 0, 'fast': 1},
		'time_on_defense': 'num-yes',
		'driver_skill': 'number',
		'endgame_climb': {'low_bar': 4, 'mid_bar': 6, 'high_bar': 10, 'traverse_bar': 15,'no_attempt': 0, 'failed': -1},
		'endgame_climb_time': 'number',
		'teleop_robot_died': 'num-yes'
	},
	schema: {
		'games_played': 0,	
		'auto_taxi': 0,
		'auto_low_goals':0,
		'auto_high_goals': 0,
		'teleop_low_goals': 0,
		'teleop_high_goals': 0,
		'speed': 0,
		'time_on_defense': 0,
		'driver_skill': 0,
		'endgame_climb': 0,
		'endgame_climb_time': 0,
		'teleop_robot_died': 0
	}
};