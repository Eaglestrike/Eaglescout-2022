var utils = require("../utils/utils")
const mongoose = require('mongoose');


var observationForm = require(`../games/${utils.getCurrentGame()}/observationForm.js`)

var ObservationSchema = mongoose.Schema(observationForm.getObservationFormSchema());

var Observation = module.exports = mongoose.model(`Observation${utils.getCurrentGame()}`, ObservationSchema);

module.exports.createObservation = function(newObservation, callback) {
	newObservation.save(callback);
}