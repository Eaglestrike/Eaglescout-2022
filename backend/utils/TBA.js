const config = require("../config/config");
const utils = require("./utils");
const keys = require("./keys.json");



const getEvents = async (cur_events) => {
	if(cur_events === undefined) cur_events = [utils.getCurrentEvent];
	if(cur_events.length === 0) cur_events = [utils.getCurrentEvent];
	const url = config.TBA_URL + "/events/2022/simple?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var events_ = await fetch(url)
	.then(response => {
		return response.json()
	})
	.then(data => {
		var events = data.map(event => {
			return {
				"key": event.key,
				"name": event.name,
				"current": cur_events.includes(event.key),		
			}
		})
		events.sort(function(a,b){
			return (a.name<b.name) ? -1 : 1;
		});
		events.unshift({
			"key": "practice",
			"name": "Practice",
			"current": cur_events.includes("practice"),
		})
		return events;
	})
	.catch(err => {
		console.log(err)	
	})
	return events_;
}

/*
format of
"youtube": youtube link
"image": imgur link
*/
const getMedia = async (team) => {
	const url = config.TBA_URL + "/team/frc" + team + "/media/2022?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var teamMedia = fetch(url)
	.then(response => {
		return response.json();
	})
	.then(data => {
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
		return team
	})
	return teamMedia;
}

//returns list of team numbers
const getEventTeams = async (event) => {
	if(event == null) event = utils.getCurrentEvent();
	const url = config.TBA_URL + "/event/" + event + "/teams?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var response = await fetch(url);
	var teams = response.json().map(team => team.team_number);
	return teams;
}

const getMatchList = async (event) => {
	const url = config.TBA_URL + "/event/" + event + "/matches/keys?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	return await fetch(url);
}

const getMatches = async (event) => {
	const url = config.TBA_URL + "/event/" + event + "/matches?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
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
			"match_number": match.match_number,
			"comp_level": match.comp_level, //enum [ qm, ef, qf, sf, f ]
			"winning_alliance": match.winning_alliance,
			"score_breakdown": match.score_breakdown,
			"post_time": match.post_result_time
		}
	})
	return matches
}

const getMatch = async (match) => {
	const url = config.TBA_URL + "/match/" + match + "?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	var response = await fetch(url)
	var match = response.json();
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
		"match_number": match.match_number,
		"comp_level": match.comp_level, //enum [ qm, ef, qf, sf, f ]
		"winning_alliance": match.winning_alliance,
		"score_breakdown": match.score_breakdown,
		"post_time": match.post_result_time
	}
}

module.exports = {
	getEvents,
	getMedia,
	getEventTeams,
	getMatchList,
	getMatches,
	getMatch,
}
