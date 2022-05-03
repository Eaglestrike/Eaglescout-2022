const express = require('express');
const router = express.Router();
const config = require("../config/config");
const utils = require("../utils/utils");
const keys = require("./keys.json");



router.route("/events")
.get(async (req,res) => {
	var curGame = await utils.getCurrentGame();
	const url = `${config.TBA_URL}/events/${curGame}/simple?X-TBA-Auth-Key=${keys.TBA_API_KEY}`
	var response = await fetch(url);
	var data = response.json();
	var events = data.map(event => {
		return {
			"key": event.key,
			"name": event.name,
		}
	})
	events.sort(function(a,b){
		return (a.name<b.name) ? -1 : 1;
	});
	events.unshift({
		"key": "practice",
		"name": "Practice",
	})
	res.status(200).send({msg: "Success", events: events});
})

router.route("/events/:year")
.get(async (req,res) => {
	const url = `${config.TBA_URL}/events/${req.params.year}/simple?X-TBA-Auth-Key=${keys.TBA_API_KEY}`
	try {
		var response = await fetch(url);
		var data = response.json();
		var events = data.map(event => {
			return {
				"key": event.key,
				"name": event.name,
			}
		})
		events.sort(function(a,b){
			return (a.name<b.name) ? -1 : 1;
		});
		events.unshift({
			"key": "practice",
			"name": "Practice",
		})
		res.status(200).send({msg: "Success", events: events});
	}
	catch(err) {
		return err;
	}
})

/*
format of
"youtube": youtube link
"image": imgur link
*/
router.route('/media/:team')
.get(async (req,res) => {
	var curGame = await utils.getCurrentGame();
	const url = `${config.TBA_URL}/team/frc${req.params.team}/media/${curGame}?X-TBA-Auth-Key=${keys.TBA_API_KEY}`;
	var response = await fetch(url)
	var data = response.json();
	var team = {
		"youtube": "none",
		"image": "none"
	};
	for(var media in data){
		if(data[media][type] == "youtube"){
			team["youtube"] = data[media][direct_url];
		}
		if(data[media][type] == "imgur"){
			team["image"] = data[media][direct_url];
		}
	}
	res.status(200).send({msg: "Success",media: team})
})
//returns list of team numbers
router.route("/event/:event/teams")
.get(async (req,res) => {
	var curEvent = req.params.event
	const url = config.TBA_URL + "/event/" + curEvent + "/teams?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var response = await fetch(url);
	var teams = response.json().map(team => team.team_number);
	res.status(200).send({msg: "Success", teams: teams});
})

router.route("/event/:event/matches/list")
.get(async (req,res) => {
	const url = config.TBA_URL + "/event/" + req.params.event + "/matches/keys?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var matches = await fetch(url);
	res.status(200).send({msg: "Success", matches: matches});
})
	

router.route("/event/:event/matches")
.get(async (req,res) => {
	const url = config.TBA_URL + "/event/" + req.params.event + "/matches?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var response = await fetch(url);
	var data = response.json();
	var matches = data.map(match => {
		return {
			"key": match.key,
			"red": {
				"score": match.score,
				"team": match.alliances.red.team_keys.map(team => parseInt(team.substring(3))),
			},
			"blue": {
				"score": match.score,
				"team": match.alliances.red.team_keys.map(team => parseInt(team.substring(3))),
			},
			"matchNumber": match.match_number,
			"compLevel": match.comp_level, //enum [ qm, ef, qf, sf, f ]
			"winningAlliance": match.winning_alliance,
			"scoreBreakdown": match.score_breakdown,
			"postTime": match.post_result_time
		}
	})
	res.status(200).send({msg: "Success", matches: matches});
})

module.exports = router;