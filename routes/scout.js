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
					'shoot_launch_pad': false,
					'shoot_tarmac': false,
					'shoot_terminal': false,
					'shoot_wherever': false,
					'speeds': [],
					'defense': [],
					'climb_level': [],
					'climb_time': [],
					'climb_fail': [],
					'death_percent': []
				}
			}
			var time_robot_dead = observations[observation]['teleop_time_robot_died'] == "" ? 0 : parseInt(observations[observation]['teleop_time_robot_died']);
			rankings[team]['death_percent'].push(time_robot_dead / 150);

			if (!isNaN(parseInt(observations[observation]['auto_low_goals']))) rankings[team]['auto_low_goals'].push(parseInt(observations[observation]['auto_low_goals']));
			if (!isNaN(parseInt(observations[observation]['auto_high_goals']))) rankings[team]['auto_high_goals'].push(parseInt(observations[observation]['auto_high_goals']));
			if (!isNaN(parseInt(observations[observation]['teleop_low_goals']))) rankings[team]['teleop_low_goals'].push(parseInt(observations[observation]['teleop_low_goals']));
			if (!isNaN(parseInt(observations[observation]['teleop_high_goals']))) rankings[team]['teleop_high_goals'].push(parseInt(observations[observation]['teleop_high_goals']));


			if (observations[observation]['teleop_shoot_balls'] !== undefined) {
				var intakes_array = observations[observation]['teleop_shoot_balls'].split(",");
				rankings[team]['shoot_tarmac'] = intakes_array.includes("tarmac");
				rankings[team]['shoot_launch_pad'] = intakes_array.includes("launch_pad");
				rankings[team]['shoot_terminal'] = intakes_array.includes("terminal");
				rankings[team]['shoot_wherever'] = intakes_array.includes("wherever");
				
			}
		

			if (observations[observation]['endgame_climb'] !== undefined) {
				var climb = observations[observation]['endgame_climb'];
				// Climb = 1, Climb (Leveled) = 2
				switch (climb){
					case "low_bar":
						rankings[team]["climb_level"].push(4);
						break;
					case "mid bar":
						rankings[team]["climb_level"].push(6);
						break;
					case "high_bar":
						rankings[team]["climb_level"].push(10);
						break;
					case "traverse_bar":
						rankings[team]["climb_level"].push(15);
						break;
					case "failed":
						rankings[team]["climb_fail"].push(-1);
						climb_fail.push(true)
						break;
					case "no_attempt":
						rankings[team]["climb_level"].push(0)
						break;
				}
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
					climb: req.query.filter == "climb"
				});
			} else {
				TBA.getImage(points[index]["team"], image => {
					points[index++]["image"] = image;
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