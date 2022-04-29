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
    var list = Observation.find()
    res.status(200).send({msg: "Success", list: list});
})

router.route('/list/teams/:team')
.get(async (req,res) => {
    try {
        var teamObservations = Observation.find({team: req.params.team});
        res.status(200).send({msg: "Sucessfully fetched observations", observations: teamObservations})
    }
    catch(err){
        res.status(400).send({error: "Unable to fetch observations"});
    }
})

router.route('/new')
.get(async (req,res) => {
    var game = await Game.findOne({year: parseInt(utils.getCurrentGame())})
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    var structure = {
        event: {
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
            subtitle: "The number of the match you are observing"
        },            
        team: {
            type: Number,
            input: "number",
            placeholder: "Team number only",
            title: "Team Number",
            subtitle: "This is the team number you are observing"
        },
        ...game.observationForm
    }
    res.status(200).json(structure);
   
})
.post(async (req,res) => {
    req.body.user = req.user._id;
	var newObservation = new Observation({year: utils.getCurrentGame(), ...req.body});
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
.post(async (req,res) => {
    var update = {
        userId: req.user.id,
        ...body
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




module.exports = router;