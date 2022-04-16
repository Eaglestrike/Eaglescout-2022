const { json } = require('express');
const express = require('express');
const router = express.Router();
const Observation = require("../models/observation.model");
const utils = require('../utils/utils');
const observationForm = require(`../games/${utils.getCurrentGame()}/observationForm`);

router.use((req,res,next) =>{
    utils.ensureAuthenticated(req, res, next);
})

router.route('/').get((req,res) => {
    TBA.getEvents(events => {
		events.unshift({
			"key": "all",
			"name": "All Events",
			"current": false
		})
		res.send(events)
	});
})

router.route('/list').get((req, res) => {
    Observation.find().then(observations => {
        res.json(observations);
    })
    .catch(error => {
        res.flash('error_msg', 'Unable to fetch observations');
        res.redirect('/scout');
    })
})

router.route('/new').get((req,res) => {
    TBA.getEvents((events) => {
		var structure = observationForm.getObservationFormStructure();
		structure.events = events;
		res.json(structure)
	});
})
.post((req,res) => {
    req.body.user = res.locals.user.email;
	delete req.body.action;

	var newObservation = new Observation(req.body);
    newObservation.save()
    .then(()=> res.json('Observation Added'))
    .catch(err => {
        req.flash('error_msg', 'Unable to add observation.');
    })
})


router.route('/observation/:id').get((req,res) => {
    Observation.findById(req.params.id)
    .then(observation => {
        if(observation == null){
            req.flash('error_msg', 'Unknown observation ID!');
            res.redirect('/scout/list');
            return;
        }
        if ((!res.locals.user.admin) && res.locals.user.email != observation[user]) {
            req.flash('error_msg', 'Insufficient permissions');
            res.redirect('/scout/list');
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
        req.flash('error_msg', 'Unknown observation ID!');
        res.redirect('/scout/list');
        return;
    })
})
.delete((req,res) => {
    if (res.locals.user.admin) {
		Observation.findByIdAndRemove(req.params.id)
        .then((observation) => {
			res.redirect('/scout/list');
		})
        .catch((err) => {
            req.flash('error_msg', 'Unknown observation ID!');
            res.redirect('/scout/list');
        })
	} else {
		Observation.findOneAndRemove({
			"_id": req.params.id,
			user: res.locals.user.email
		})
        .then(() => {
            res.redirect('/scout/list');
        })
        .catch(error => {
            req.flash('error_msg', 'Insufficient permissions OR unknown observation ID!');
			res.redirect('/scout/list');
        });
	}
})

router.route('/editobservation/:id').get((req, res) => {
    Observation.findById(req.params.id)
    .then((observation) => {
        if(req.locals.user.email != observation[user] && !req.locals.user.admin){
            res.flash('error_msg', 'Insufficient Permissions')
            res.redirect('/scout/list')
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
    .catch(error => {
        req.flash('error_msg', 'Unknown observation ID!');
        res.redirect('/scout/list');
    })
})
.post((req,res) => {
    Observation.findByIdAndUpdate(req.params.id, req.body)
    .then((observation) => {
        req.flash('success_msg', 'Successfully saved observation.');
        res.redirect('/scout/list');
    })
    .catch((err) => {
        req.flash('error_msg', 'Unable to edit observation.');
        res.redirect('/scout/list');
    })
	
})
module.exports = router;