var utils = require("../utils/utils")
const mongoose = require('mongoose');

var observationFormSchema = {
    userId: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    match: {
        type: Number,
        required: true
    },
    team: {
        type: Number,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
}
var ObservationSchema = mongoose.Schema(observationFormSchema);

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);
