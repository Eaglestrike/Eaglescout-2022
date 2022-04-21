var express = require('express');
var router = express.Router();
var Observation = require("../models/observation");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");
var userlist = require("../userlist.js");
var filters = require("../config/filters");
var multipliers = require("../config/multipliers");
var summary = require("../config/summary");
var game = require("../config/game.js");
var chartConfig = require("../config/chartConfig.js")

router.get('/list', utils.ensureAuthenticated, function(req, res) {
	var cur_events = req.query.events;
	if(cur_events == undefined) cur_events = utils.getCurrentEvent();
	cur_events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in cur_events){
		if(cur_events[event] == "all"){
			filter = {};
			break;
		}
		filter.$or.push({'competition': cur_events[event]});
	}
	Observation.find(filter
	, function(err, observations) {
		observations.sort(function(a,b) {
			return a.team - b.team;
		});
		TBA.getEvents(events => {
			events.unshift({
				"key": "all",
				"name": "All Events",
				"current": false
			})
			for(var i in events){
				events[i].current = false;			
				for(var event in cur_events){
					if(events[i].key == cur_events[event]){
						events[i].current = true;
						continue;
					}
				}
			}
			res.render("list", {
				events: events,
				observations: observations,
				res: res
			});
		});
		// observations = [];
		
	});
})

router.get('/list/:team', utils.ensureAuthenticated, function(req, res) {
	var cur_events = req.query.events;
	if(cur_events == undefined) cur_events = utils.getCurrentEvent();
	cur_events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in cur_events){
		if(cur_events[event] == "all"){
			filter = {};
			break;
		}
		filter.$or.push({'competition': cur_events[event]});
	}
	filter['team']= req.params.team;
	Observation.find(filter
	, function(err, observations) {
		observations.sort(function(a,b) {
			return a.team - b.team;
		});
			
	//maxes
	var games_played = 0;
	var robotCapabilities = {
		auto_taxi: 0,
		auto_low_goals: 0,
		auto_high_goals: 0,
		teleop_low_goals: 0,
		teleop_high_goals: 0,
		teleop_eject_balls: [],
		teleop_shoot_balls: [],
		//0 is slow, 1 is medium, 2 is fast
		speed: 0,
		//climb is 0 is none, 1 is low, 2 is mid, 3 is high, 4 is traversal
		endgame_climb: 0,
		teleop_robot_died: [],
		time_on_defense: [],
	};
	//averages
	var robotAverages = {
		auto_taxi: 0,
		auto_low_goals: 0,
		auto_high_goals: 0,
		teleop_low_goals: 0,
		teleop_high_goals: 0,
		endgame_climb: 0,
		points_generated: 0
	};
	function removeDuplicates(a) {
		for(var i=0; i<a.length; ++i) {
			if(a[i] == "" || a[i]==undefined) 
				a.splice(i--,1);
			for(var j=i+1; j<a.length; ++j) {
				if(a[i] === a[j])
					a.splice(j--, 1);
			}
		}
	
		return a;
	};
	for(var observation in observations){
		games_played++;

		for(var key in robotCapabilities){
			if(observations[observation][key] == null || observations[observation][key] == undefined || observations[observation][key]=="") continue;
			if(typeof(summary.capabilities[key]) == 'object'){
				robotCapabilities[key] = Math.max(robotCapabilities[key],summary.capabilities[key][observations[observation][key]]);
			}
			if(summary.capabilities[key] == 'number'){
				robotCapabilities[key] = Math.max(robotCapabilities[key],parseInt(observations[observation][key]));
			}
			else if(summary.capabilities[key] == 'string_arr'){
				robotCapabilities[key] = removeDuplicates(robotCapabilities[key].concat(observations[observation][key].split(',')));
			}
			else if(summary.capabilities[key] == 'match_list'){
				if(isNaN(parseInt(observations[observation][key]))){
					if(observations[observation][key] == 'yes'){
						robotCapabilities[key].push(parseInt(observations[observation]['match']));
					}
				}
				else{
					if(observations[observation][key] > 0){
						robotCapabilities[key].push(parseInt(observations[observation]['match']));
					}
				}
			}
		}
		
		for(var key in robotAverages){
			if(observations[observation][key] == null || observations[observation][key] == undefined ||observations[observation][key]=="") continue;
			if(typeof(summary.capabilities[key]) == 'object'){
				robotAverages[key] += game.points[key][observations[observation][key]];
			}
			else{
				robotAverages[key] += game.points[key] * parseInt(observations[observation][key]);
			}
		}
		
	}
	for(var key in robotCapabilities){
		if(typeof(summary.capabilities[key]) == 'object'){
			var rsum = summary.capabilities[key];
			robotCapabilities[key] = Object.keys(rsum).find(val => rsum[val] === robotCapabilities[key]);
		}
		if(summary.capabilities[key]=='match_list'){
			robotCapabilities[key] = removeDuplicates(robotCapabilities[key]).sort(function(a, b) {
				return a - b;
			  });
		}
	}
	sum = 0;
	
	for(var key in robotAverages){
		if(key == 'points_generated'){
			continue;
		}
		sum+=robotAverages[key];
		robotAverages[key] = robotAverages[key]/games_played;
		
	}
	robotAverages['points_generated'] = sum/games_played;
	TBA.getEvents(events => {
		events.unshift({
			"key": "all",
			"name": "All Events",
			"current": cur_events.includes('all')
		})
		TBA.getImage(req.params.team, image => {
			res.render('list', {
				events: events,
				teamAverage: robotAverages,
				teamCapabilities: robotCapabilities,
				observations: observations,
				res: res,
				team: req.params.team,
				img: image
			});
		}, cur_events);		
	});	
	});	
});

router.get('/graphic', utils.ensureAuthenticated, function(req,res) {
	var cur_events = req.query.events;
	if(cur_events == undefined) cur_events = utils.getCurrentEvent();
	cur_events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in cur_events){
		if(cur_events[event] == "all"){
			filter = {};
			break;
		}
		filter.$or.push({'competition': cur_events[event]});
	}
	Observation.find(filter, function(err, observations) {
		var rankings = {};
		for (var observation in observations) {
			var team = observations[observation]["team"];
			if (!(team in rankings)) {
				rankings[team] = {};
				for(var category in game.points){
					rankings[team][category] = 0;
				}
				rankings[team]['games_played'] = 0;
			}
			rankings[team]['games_played']++;
			for(var category in game.points){
				if(observations[observation][category] == null || observations[observation][category] == undefined || observations[observation][category]=="") continue;
				if(typeof(game.points[category]) == 'object'){
					rankings[team][category] += game.points[category][observations[observation][category]];
				}
				else {
					rankings[team][category] += parseInt(observations[observation][category]) * game.points[category];
				}
			}
		}
		var points = [];
		for (var team in rankings) {
			for(var category in game.points){
				rankings[team][category] /= rankings[team]['games_played'];
			}
			var currentObj = {
				team: team
			}
			var total = 0;
			var autoPoints = 0;
			var teleopPoints = 0;
			var endgamePoints = 0;
			for(var category in game.points){
				if(category.split("_")[0] == 'auto') {
					autoPoints += rankings[team][category]
				}
				else if(category.split("_")[0] == 'teleop') {
					teleopPoints += rankings[team][category]
				}
				else if(category.split("_")[0] == 'endgame') {
					endgamePoints += rankings[team][category]
				}
			}
			total = autoPoints+teleopPoints+endgamePoints;
			currentObj['points'] = total;
			currentObj['auto'] = autoPoints;
			currentObj['teleop'] = teleopPoints;
			currentObj['endgame'] = endgamePoints;
			points.push(currentObj);
		}
		points.sort(function(a,b) {
			return b['points'] - a['points'];
		});
		const data = {
			labels: points.map(currentTeam => currentTeam.team),
			data: [
				{
					label: 'Auto',
					data: points.map(currentTeam => currentTeam.auto),
					backgroundColor: 'rgb(255, 99, 132)',
				},
				{
					label: 'Teleop',
					data: points.map(currentTeam => currentTeam.teleop),
					backgroundColor: 'rgb(54, 162, 235)',
				},
				{
					label: 'Endgame',
					data: points.map(currentTeam => currentTeam.endgame),
					backgroundColor: 'rgb(255, 205, 86)',
				}
			]
		}
		TBA.getEvents(events => {
			events.unshift({
				"key": "all",
				"name": "All Events",
				"current": cur_events.includes('all')
			})
			res.render("graphic", {
				events: events,
				rankingChart: data
			});
		}, cur_events);
	});
});

router.get('/teamranking', utils.ensureAuthenticated, function(req, res) {
	var cur_events = req.query.events;
	if(cur_events == undefined) cur_events = utils.getCurrentEvent();
	cur_events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in cur_events){
		if(cur_events[event] == "all"){
			filter = {};
			break;
		}
		filter.$or.push({'competition': cur_events[event]});
	}
	Observation.find(filter, function(err, observations) {
		var rankings = {};
		for (var observation in observations) {
			var team = observations[observation]["team"];
			if (!(team in rankings)) {
				rankings[team] = JSON.parse(JSON.stringify(multipliers.schema));
			}

			for(var category in multipliers.structure){
				if(category == 'games_played') {
					rankings[team][category]++;
					continue;
				}
				if(observations[observation][category] == null || observations[observation][category] == undefined || observations[observation][category]=="") continue;
				if(typeof(multipliers.structure[category]) == 'object'){
					rankings[team][category] += multipliers.structure[category][observations[observation][category]];
				}
				else if(multipliers.structure[category] == 'number'){
					rankings[team][category] += parseInt(observations[observation][category]);
				}
				
				else if(multipliers.structure[category] == 'num-yes'){
					rankings[team][category] += (parseInt(observations[observation][category]) > 0) *1;
				}				
			}
		}
		var points = [];
		for (var ranking in rankings) {
			var currentObj = {
				team: ranking
			}
			for(filter in filters){
				var currentPoints = 0;
				for (var multiplier in filters[filter]) {
					currentPoints+=(rankings[ranking][multiplier]*filters[filter][multiplier]);
				}
				currentPoints/=rankings[ranking]['games_played']
				currentObj[filter] = Math.round(currentPoints);
			}
			points.push(currentObj);
		}
		filter=req.query.filter
		if(filter == undefined) filter = 'points';
		if(filters[filter] == undefined) filter = 'points';
		points.sort(function(a,b) {
			return b[filter] - a[filter];
		});
		TBA.getEvents(events => {
			events.unshift({
				"key": "all",
				"name": "All Events",
				"current": cur_events.includes('all')
			})
			res.render("teamranking", {
			  	events: events,
			  	rankings: points,
				filter: filter,
				goals: filter == "goals",
				points: filter == "points",
				defense: filter == "defense",
				climb: filter == "climb"
			});
		}, cur_events);
	});
	
});

router.get('/csv', utils.ensureAuthenticated, function(req, res) {
	var cur_events = req.query.events;
	if(cur_events == undefined) cur_events = "all";
	events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in events){
		if(events[event] == "all"){
			cur_events = "all";
			filter = {};
			break;
		}
		filter.$or.push({'competition': events[event]});
	}
	res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename='+'observations.csv'
    });
    Observation.find(filter).csv(res);
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
	
	Observation.findOneAndUpdate({
		"_id": req.params.id
	}, req.body, function (err) {
		if (err) throw err;

		req.flash('success_msg', 'Successfully saved observation.');
		res.redirect("/scout/list");
	});
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	TBA.getEvents(events => {
		events.unshift({
			"key": "all",
			"name": "All Events",
			"current": false
		})
		res.render("scout", {
			events: events
		});
	});
});

module.exports = router;