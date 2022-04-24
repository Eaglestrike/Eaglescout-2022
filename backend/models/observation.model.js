var utils = require("../utils/utils")
const mongoose = require('mongoose');

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
var ObservationSchema = mongoose.Schema(observationFormSchema);

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);
