const Game = require("../models/game.model")
const PitScouting = require("../models/pitscouting.model")
const express = require("express")
const loginUtils = require("../utils/login");
const utils = require("../utils/utils");
const router = express.Router();

router.use((req,res,next) => {
    loginUtils.verifyJWT(req,res,next);
    next()
})

router.route("/list")
.get(loginUtils.ensureUser, async (req,res) => {
    var list = await PitScouting.find();
    res.status(200).send({msg: "Success", list: list});
})

router.route('/id/:id')
.get(async (res,res) => {
    var pitSCouting = PitScouting.findById(req.params.id);
    if(!pitScouting) return res.status(400).send({error: "Pit Scouting observation not found"});
    res.status(200).send({msg: "Success", pitScouting: pitScouting});
})
.put(async (req,res) => {
    var pitScouting = PitScouting.findByIdAndUpdate(req.params.id, req.body);
    if(!pitScouting) return res.status(400).send({error: "Pit Scouting observation not found"});
    res.status(200).send({msg: "Success"});
})

router.route('/new')
.get(async (req,res) => {
    var game = await Game.findOne({year: parseInt(utils.getCurrentGame())})
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    var structure = {
        year: parseInt(utils.getCurrentGame()),
        event: {
            input: "dropdown",
            placeholder: "Select a competition",
            title: "Current competition",
            subtitle: "If you're at a practice match, select \"Practice Match\""
        },          
        team: {
            input: "number",
            placeholder: "Team number only",
            title: "Team Number",
            subtitle: "This is the team number you are observing"
        },
        ...game.pitScoutingForm
    }
    res.status(200).json(structure);
})
.post(loginUtils.ensureUser, async (req,res) => {
    req.body.user = req.user._id;
	var newObservation = new PitScouting(req.body);
    try {
        await newObservation.save()
        res.status(200).send({msg: 'Observation Added'});
    }
    catch(err) {
        res.status(400).send({error: 'Unable to add observation.'});

    }
})

router.route('/team/:team')
.get(async (req,res) => {
    try {
        var list = await PitScouting.find({team: req.params.team});
        res.status(200).send({msg: "Sucessfully fetched observations", pitScouting: list})
    }
    catch(err){
        res.status(400).send({error: "Unable to fetch observations"});
    }
})

router.route('/events/:event')
.get(async (req,res) => {
    var list = await PitScouting.find({
        event: req.params.event
    })
    res.status(200).send({msg: "Success", pitScouting: list});
})

router.route('/events/:event/team/:team')
.get(async (req,res) => {
    var list = await PitScouting.find({
        team: req.params.team,
        event: req.params.event
    })
    res.status(200).send({msg: "Success", pitScouting: list});
})

router.route('/id/:id')
.get(async (req,res) => {
    var pitScouting = PitScouting.findById(req.params.id);
    if(!pitScouting) return res.status(400).send({error: "Unable to find pit scouting observation"});
    res.status(200).send({msg: "Success",pitScouting: pitScouting});
})
.delete(async (req,res) => {
    if (res.user.roles=='admin') {
		var observation = await pitScouting.findByIdAndRemove(req.params.id);
        if(!observation) return res.status(400).send({'error': 'Unknown observation ID!'});
        return res.status(200).send({'msg': 'Succesfully deleted observation'});
	} else {
		var observation = await pitScouting.findOneAndRemove({
			"_id": req.params.id,
			user: res.user.email
		});
        if(!observation) return res.status(403).send({'error': 'Insufficient permissions OR unknown observation ID!'});
        return res.status(200).send({'msg': 'Succesfully deleted observation'});
	}
})
.put(async (req,res) => {
    var update = {
        userId: req.user.id,
        ...req.body
    }
    try {
        var updated = await pitScouting.findByIdAndUpdate(req.params.id, update)
        if(!updated) return res.status(400).send({error: "Could not find observation"});
        return res.status(200).send({'msg': 'Successfully saved observation'});
    }  
    catch(err) {
        return res.status(400).send({error: err});
    }
})

module.exports = router