var utils = require("../utils/utils")
const mongoose = require('mongoose');

var observationFormSchema = {
    userId: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    compLevel: {
        type: String,
        enum: ['qm','ef', 'qf','sf','f']
    },
    //either qualification match number or set number
    match: {
        type: Number,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
}
var ObservationSchema = mongoose.Schema(observationFormSchema);

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);
