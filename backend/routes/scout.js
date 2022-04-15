const express = require('express');
const router = express.Router();
const Observation = require("../models/observation");
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
		res.render("scout", {
			events: events
		});
	});
})
router.route('/new').get((req,res) => {
    TBA.getEvents((events) => {
		var structure = observationForm.getObservationFormStructure();
		structure.events = events;
		res.render('new', {
			structure: structure
		});
	});
}).post((req,res) => {
    req.body.user = res.locals.user.email;
	delete req.body.action;

	var newObservation = new Observation(req.body);

	Observation.createObservation(newObservation, function(err, user) {
		if (err) throw err;
	});

	req.flash('success_msg', 'Successfully created observation.');
	res.redirect("/scout");
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
            res.render('editobservation', {
                observationID: req.params.id,
                observation: observation,
                structure: structure
            });
        });
    }).catch(err => {
        req.flash('error_msg', 'Unknown observation ID!');
        res.redirect('/scout/list');
        return;
    })
}).delete((req,res) => {

})
module.exports = router;