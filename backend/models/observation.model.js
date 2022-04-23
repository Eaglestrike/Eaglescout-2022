var utils = require("../utils/utils")
const mongoose = require('mongoose');


// var observationForm = require(`../games/${utils.getCurrentGame()}/observationForm.js`)
var observationFormSchema = {
    year: {
        type: Number
    },
    event: {
        type: String
    },
    match: {
        type: Number
    },
    team: {
        type: Number
    },
    game: {
        type: mongoose.Schema.Types.Mixed
    }
}
var ObservationSchema = mongoose.Schema(observationForm.getObservationFormSchema());

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);
