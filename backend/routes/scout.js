const { json } = require('express');
const express = require('express');
const router = express.Router();
const Observation = require("../models/observation.model");
const Game = requrie("../models/game.model");
const utils = require('../utils/utils');
const loginUtils = require('../utils/login');
// const observationForm = require(`../games/${utils.getCurrentGame()}/observationForm`);
/*
Change user stuff cuz it kinda bad rn
*/
router.use((req,res,next) =>{
    loginUtils.ensureAuthenticated(req, res, next);
    // utils.ensureAuthenticated(req, res, next);
})


router.route('/list').get((req, res) => {
    Observation.find().then(observations => {
        res.status(200).json(observations);
    })
    .catch(error => {
        res.status(400).send({'error': 'Unable to fetch observations'});
    })
})

router.route('/new').get((req,res) => {
    Game.findOne({year: parseInt(utils.getCurrentGame())})
    .then(game => {
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
    .catch(error => {
        res.status(400).send({"error": "Could not find game for current year"});
    })  
})
.post((req,res) => {
    req.body.user = req.user._id;
	delete req.body.action;
	var newObservation = new Observation({year: utils.getCurrentGame(), ...req.body});
    newObservation.save()
    .then(()=> res.status(200).json('Observation Added'))
    .catch(err => {
        res.status(400).send({'error': 'Unable to add observation.'});
    })
})

router.route('/observation/:id').get((req,res) => {
    Observation.findById(req.params.id)
    .then(observation => {
        if(observation == null){
            res.status(400).send({'error': 'Unknown observation ID!'});
            return;
        }
        if ((!res.locals.user.admin) && res.locals.user.email != observation[user]) {
            res.status(403).send({'error': 'Insufficient permissions'});
            return;
        }
        TBA.getEvents((events) => {
            var structure = observationForm.getObservationFormStructure();
            structure.events = events;
            res.json({
                observationID: req.params.id,
                observation: observation,
                structure: structure
            });
        });
    })
    .catch(err => {
        res.status(400).send({'error': 'Unknown observation ID!'});
    })
})
.delete((req,res) => {
    if (res.locals.user.admin) {
		Observation.findByIdAndRemove(req.params.id)
        .then((observation) => {
            res.status(200).send({'msg': 'Succesfully deleted observation'});
		})
        .catch((err) => {
            res.status(400).send({'error': 'Unknown observation ID!'});
        })
	} else {
		Observation.findOneAndRemove({
			"_id": req.params.id,
			user: res.locals.user.email
		})
        .then(() => {
            res.status(200).send({'msg': 'Succesfully deleted observation'});
        })
        .catch(error => {
            res.status(403).send('error', 'Insufficient permissions OR unknown observation ID!');
        });
	}
})

router.route('/editobservation/:id').get((req, res) => {
    Observation.findById(req.params.id)
    .then((observation) => {
        if(req.locals.user.email != observation[user] && !req.locals.user.admin){
            res.status(400).send({'error': 'Insufficient Permissions'})
            return;
        }
        var structure = observationForm.getObservationFormStructure();
        structure.events = events;
        res.status(200).json({
            observationID: req.params.id,
            observation: observation,
            structure: structure
        })
    })
    .catch(error => {
        res.status(400).send('error_msg', 'Unknown observation ID!');
    })
})
.post((req,res) => {
    Observation.findByIdAndUpdate(req.params.id, req.body)
    .then((observation) => {
        res.status(200).send({'msg': 'Successfully saved observation'});
    })
    .catch((err) => {
        res.status(200).send({'error': 'Unable to edit observation.'});
    })
	
})

module.exports = router;