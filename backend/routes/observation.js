const express = require('express');
const router = express.Router();
const Observation = require("../models/observation.model");
const Game = require("../models/game.model");
const utils = require('../utils/utils');
const loginUtils = require('../utils/login');
//probably want to move files around to make api make more sense
router.use((req,res,next) => {
    loginUtils.verifyJWT(req, res, next);
})

router.use((req,res,next) => {
    loginUtils.ensureUser(req,res,next);
})

router.route('/list')
.get(async (req, res) => {
    var list = await Observation.find();
    res.status(200).send({msg: "Success", observations: list});
})

router.route('/list/game/:game')
.get(async (req,res) => {
    var list = await Observation.find({name: req.params.game});
    res.status(200).send({msg: "Success", observations: list})
})

router.route('/list/game/:game/team/:team')
.get(async (req,res) => {
    var list = await Observation.find({name: req.params.game, team: team});
    res.status(200).send({msg: "Success", observations: list})
})

router.route('/team/:team')
.get(async (req,res) => {
    var list = await Observation.find({team: req.params.team});
    res.status(200).send({msg: "Success", observations: list})
    
})

router.route('/events/:event')
.get(async (req,res) => {
    var list = await Observation.find({
        event: req.params.event
    })
    res.status(200).send({msg: "Success", observations: list});
})

router.route('/events/:event/team/:team')
.get(async (req,res) => {
    var list = await Observation.find({
        team: req.params.team,
        event: req.params.event
    })
    res.status(200).send({msg: "Success", observations: list});
})

router.route('/list/:matchstring')
.get(async (req,res) => {
    var match = utils.readMatchString(req.params.matchstring);
    if(!match) return res.status(400).send({error: "Invalid match string"});
    var list = await Observation.find(match);
    if(!list.length) return res.status(400).send({error: "No observations with that match string"});
    return res.status(200).send({msg: "Success", observations: list});
})

router.route('/new')
.get(async (req,res) => {
    var game = await Game.findOne({name: utils.getCurrentGame()})
    if(!game) return res.status(400).send({error: "Could not find game"});
    var structure = {
        game: utils.getCurrentGame(),
        event: {
            input: "dropdown",
            category: "info",
            placeholder: "Select a competition",
            title: "Current competition",
            subtitle: "If you're at a practice match, select \"Practice Match\"",
            required: true
        },
        compLevel: {
            input: "dropdown",
            category: "info",
            placeholder: "Select Competition Level",
            data: {
                "qm": "Qualification Match",
                'qf': "Quarterfinals",
                'sf': "Semifinals",
                'f': "Finals"
            },
            title: "Competition level",
            subtitle: "The competition level is the match you are observing",
            required: true,
        },
        match: {
            input: "number",
            category: "info",
            placeholder: "Match number only",
            title: "Match Number",
            subtitle: "The number of the match you are observing",
            required: true
        },            
        team: {
            input: "number",
            category: "info",
            placeholder: "Team number only",
            title: "Team Number",
            subtitle: "This is the team number you are observing",
            required: true
        },
        ...game.observationForm
    }
    res.status(200).json(structure);
   
})
.post(async (req,res) => {
    req.body.user = req.user._id;
	var newObservation = new Observation(req.body);
    try {
        await newObservation.save()
        res.status(200).send({msg: 'Observation Added'});
    }
    catch(err) {
        res.status(400).send({'error': 'Unable to add observation.'});

    }
})

router.route('/new/:matchstring')
.get(async (req,res) => {
    var matchinfo = utils.readMatchString(req.params.matchstring);
    var game = await Game.findOne({name: matchinfo.game})
    if(!game) return res.status(400).send({error: "Could not find game"});
    
    var structure = {
        game: matchinfo.game,
        event: {
            input: "dropdown",
            category: "info",
            value: matchinfo.event,
            title: "Current competition",
            subtitle: "If you're at a practice match, select \"Practice Match\"",
            required: true,
        },
        compLevel: {
            input: "dropdown",
            category: "info",
            value: matchinfo.compLevel,
            data: {
                "qm": "Qualification Match",
                'qf': "Quarterfinals",
                'sf': "Semifinals",
                'f': "Finals"
            },
            title: "Competition level",
            subtitle: "The competition level is the match you are observing",
            required: true
        },
        match: {
            input: "number",
            category: "info",
            value: matchinfo.match,
            title: "Match Number",
            subtitle: "The number of the match you are observing",
            required: true
        },            
        team: {
            input: "number",
            category: "info",
            value: matchinfo.team,
            title: "Team Number",
            subtitle: "This is the team number you are observing",
            required: true
        },
        ...game.observationForm
    }
    res.status(200).send({form: structure});
})
.post(async (req,res) => {
    req.body.user = req.user._id;
	var newObservation = new Observation(req.body);
    try {
        await newObservation.save()
        res.status(200).send({msg: 'Observation Added'});
    }
    catch(err) {
        res.status(400).send({'error': 'Unable to add observation.'});

    }
})

router.route('/id/:id')
.get(async (req,res) => {
    var observation = await Observation.findById(req.params.id);
    if(!observation) return res.status(400).send({'error': 'Unknown observation ID!'});
    res.status(200).send({msg: "Successfuly found observation", observation: observation});
})
.delete(async (req,res) => {
    if (res.user.roles=='admin') {
		var observation = await Observation.findByIdAndRemove(req.params.id);
        if(!observation) return res.status(400).send({'error': 'Unknown observation ID!'});
        return res.status(200).send({'msg': 'Succesfully deleted observation'});
	} else {
		var observation = await Observation.findOneAndRemove({
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
        var updated = await Observation.findByIdAndUpdate(req.params.id, update)
        if(!updated) return res.status(400).send({error: "Could not find observation"});
        return res.status(200).send({'msg': 'Successfully saved observation'});
    }  
    catch(err) {
        return res.status(400).send({error: err});
    }
})


// router.route("/event/:event/")

module.exports = router;