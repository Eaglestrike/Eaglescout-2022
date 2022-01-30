var express = require('express');
var router = express.Router();
var Observation = require("../models/observation");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");
var userlist = require("../userlist.js");
var filters = require("../config/filters");
var multipliers = require("../config/multipliers");

router.get('/list', utils.ensureAuthenticated, function(req, res) {
	Observation.find({}, function(err, observations) {
		observations.sort(function(a,b) {
			return a.team - b.team;
		});
		res.render('list', {
			observations: observations,
			res: res
		});
	});
});

router.get('/list/:team', utils.ensureAuthenticated, function(req, res) {
	Observation.find({
		team: req.params.team
	}, function(err, observations) {
		observations.sort(function(a,b) {
			return a.team - b.team;
		});
		res.render('list', {
			observations: observations,
			res: res,
			team: req.params.team
		});
	});
});

router.get('/teamranking', utils.ensureAuthenticated, function(req, res) {
	Observation.find({}, function(err, observations) {
		var rankings = {};
		for (var observation in observations) {
			var team = observations[observation]["team"];
			if (!(team in rankings)) {
				// Custom stuff
				rankings[team] = {
					'auto_low_goals': [],
					'auto_high_goals': [],
					'teleop_low_goals': [],
					'teleop_high_goals': [],
					'teleop_inner_goals': [],
					'intake_player': false,
					'intake_ground': false,
					'shoot_trench_run': false,
					'shoot_target_zone': false,
					'shoot_across_field': false,
					'control_success': [],
					'control_speeds': [],
					'speeds': [],
					'defense': [],
					'climb': [],
					'climb_fail': [],
					'active_leveling': false,
					'death_percent': []
				}
			}
			var time_robot_dead = observations[observation]['teleop_time_robot_died'] == "" ? 0 : parseInt(observations[observation]['teleop_time_robot_died']);
			rankings[team]['death_percent'].push(time_robot_dead / 150);

			if (!isNaN(parseInt(observations[observation]['auto_low_goals']))) rankings[team]['auto_low_goals'].push(parseInt(observations[observation]['auto_low_goals']));
			if (!isNaN(parseInt(observations[observation]['auto_high_goals']))) rankings[team]['auto_high_goals'].push(parseInt(observations[observation]['auto_high_goals']));
			if (!isNaN(parseInt(observations[observation]['teleop_low_goals']))) rankings[team]['teleop_low_goals'].push(parseInt(observations[observation]['teleop_low_goals']));
			if (!isNaN(parseInt(observations[observation]['teleop_high_goals']))) rankings[team]['teleop_high_goals'].push(parseInt(observations[observation]['teleop_high_goals']));
			if (!isNaN(parseInt(observations[observation]['teleop_inner_goals']))) rankings[team]['teleop_inner_goals'].push(parseInt(observations[observation]['teleop_inner_goals']));

			rankings[team]['intake_player'] = false;
			rankings[team]['intake_ground'] = false;
			if (observations[observation]['teleop_collect_balls'] !== undefined) {
				var intakes_array = observations[observation]['teleop_collect_balls'].split(",");
				rankings[team]['intake_player'] = intakes_array.includes("player_station");
				rankings[team]['intake_ground'] = intakes_array.includes("ground");
			}

			rankings[team]['shoot_trench_run'] = false;
			rankings[team]['shoot_target_zone'] = false;
			rankings[team]['shoot_across_field'] = false;
			if (observations[observation]['teleop_shoot_balls'] !== undefined) {
				var intakes_array = observations[observation]['teleop_shoot_balls'].split(",");
				rankings[team]['shoot_trench_run'] = intakes_array.includes("trench_run");
				rankings[team]['shoot_target_zone'] = intakes_array.includes("target_zone");
				rankings[team]['shoot_across_field'] = intakes_array.includes("across_field");
			}

			var control_success = 0;
			if (observations[observation]['teleop_color_wheel'] !== undefined) {
				switch(observations[observation]['teleop_color_wheel']) {
					case 'success_all':
						control_success = 2;
						break;
					case 'success_rotation':
						control_success = 1;
						break;
					default:
						break;
				}
			}
			rankings[team]['control_success'].push(control_success);

			var control_speed = 0;
			if (observations[observation]['teleop_rotation_time'] !== undefined) {
				switch(observations[observation]['teleop_rotation_time']) {
					case 'slow':
						control_speed = -1;
						break;
					case 'fast': 
						control_speed = 1;
						break;
					default:
						break;
				}
			}
			rankings[team]['control_speeds'].push(control_speed);


			if (observations[observation]['endgame_climb'] !== undefined) {
				var climb_array = observations[observation]['endgame_climb'].split(",");
				// Climb = 1, Climb (Leveled) = 2
				rankings[team]['climb'].push(
					(climb_array.includes("successful") ? 1 : 0) + 
					(climb_array.includes("level") ? 1 : 0)
				)
				// Fail = 1, No Attempt = 0
				if (climb_array.includes("failed")) rankings[team]['climb_fail'].push(1);
				if (climb_array.includes("no_attempt")) rankings[team]['climb_fail'].push(0);

				rankings[team]['active_leveling'] = climb_array.includes("active_leveling");
			}

			// Only count speed if time dead is less than 120 seconds
			if (time_robot_dead < 120 && observations[observation]['speed'] != null && observations[observation]['speed'] != "") {
				var speed;
				switch (observations[observation]['speed']) {
					case "slow": 
					speed = -1;
					break;
					case "medium": 
					speed = 0;
					break;
					case "fast": 
					speed = 1;
					break;
				}
				rankings[team]['speeds'].push(speed);
			}
		}

		var points = [];
		for (var ranking in rankings) {
			var filter;
			switch (req.query.filter) {
				case "goals":
					filter = filters.goals;
					break;
				case "shooting":
					filter = filters.shooting;
					break;
				case "control":
					filter = filters.control;
					break;
				case "intakes":
					filter = filters.intakes;
					break;
				case "speeds":
					filter = filters.speeds;
					break;
				case "climb":
					filter = filters.climb;
					break;
				case "undefined":
					filter = multipliers.multipliers;
					break;
				default:
					filter = multipliers.multipliers;
					break;
			}
			var currentObj = {
				team: ranking
			}
			var currentPoints = 0;
			for (var multiplier in filter) {
				if (Array.isArray(rankings[ranking][multiplier])) currentPoints += utils.average(rankings[ranking][multiplier]) * filter[multiplier];
				else if (typeof(rankings[ranking][multiplier]) == "boolean") currentPoints += (rankings[ranking][multiplier] ? filter[multiplier] : 0);
				else currentPoints += rankings[ranking][multiplier] * filter[multiplier];
			}
			currentObj['points'] = Math.round(currentPoints);
			points.push(currentObj);
		}

		var index = 0;
		function asyncForLoop() {
			if (index == points.length) {
				points.sort(function(a,b) {
					return b.points - a.points;
				});
				res.render('teamranking', {
					points: points,
					goals: req.query.filter == "goals",
					shooting: req.query.filter == "shooting",
					control: req.query.filter == "control",
					intakes: req.query.filter == "intakes",
					speeds: req.query.filter == "speeds",
					climb: req.query.filter == "climb"
				});
			} else {
				TBA.getImage(points[index]["team"], image => {
					points[index ++]["image"] = image;
					asyncForLoop();
				});
			}
		}
		asyncForLoop();
	});
});

router.get('/csv', utils.ensureAuthenticated, function(req, res) {
	res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=observations.csv'
    });
    Observation.find({}).csv(res);
});

router.get('/new', utils.ensureAuthenticated, function(req, res) {
	TBA.getEvents((events) => {
		var structure = observationForm.getObservationFormStructure();
		structure.events = events;
		res.render('new', {
			structure: structure
		});
	});
});

router.post('/new', utils.ensureAuthenticated, function(req, res) {
	req.body.user = res.locals.user.email;
	delete req.body.action;
	var newObservation = new Observation(req.body);

	Observation.createObservation(newObservation, function(err, user) {
		if (err) throw err;
	});

	req.flash('success_msg', 'Successfully created observation.');
	res.redirect("/scout");
});

router.get('/editobservation/:id', utils.ensureAuthenticated, function(req, res) {
	if (res.locals.user.admin) {
		Observation.findOne({
			"_id": req.params.id
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Unknown observation ID!');
				res.redirect('/scout/list');
				return;
			}
			TBA.getEvents((events) => {
				var structure = observationForm.getObservationFormStructure();
				structure.events = events;
				res.render('editobservation', {
					observationID: req.params.id,
					observation: observation,
					structure: structure
				});
			});
		});
	} else {
		Observation.findOne({
			"_id": req.params.id,
			user: res.locals.user.email
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Insufficient permissions OR unknown observation ID!');
				res.redirect('/scout/list');
				return;
			}
			TBA.getEvents((events) => {
				var structure = observationForm.getObservationFormStructure();
				structure.events = events;
				res.render('editobservation', {
					observationID: req.params.id,
					observation: observation,
					structure: structure
				});
			});
		});
	}
});

router.get('/delobservation/:id', utils.ensureAuthenticated, function(req, res) {
	if (res.locals.user.admin) {
		Observation.findOneAndRemove({
			"_id": req.params.id
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Unknown observation ID!');
			}
			res.redirect('/scout/list');
		});
	} else {
		Observation.findOneAndRemove({
			"_id": req.params.id,
			user: res.locals.user.email
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Insufficient permissions OR unknown observation ID!');
			}
			res.redirect('/scout/list');
		});
	}
});

router.post('/saveobservation/:id', utils.ensureAuthenticated, function(req, res) {
	req.body.user = res.locals.user.email;
	delete req.body.action;

	console.log(req.body);

	Observation.findOneAndUpdate({
		"_id": req.params.id
	}, req.body, function (err) {
		if (err) throw err;

		req.flash('success_msg', 'Successfully saved observation.');
		res.redirect("/scout/list");
	});
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('scout');
});

module.exports = router;