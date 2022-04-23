const mongoose = require('mongoose');
var utils = require('../utils/utils');
var gameSummary = require(`../games/${utils.getCurrentGame()}/gameSummary`)

var Schema = {
    year: {
        type: Number
    },
    team: {
        type: String,
    },
    event: {
        type: String,
    },
    averages: {
        type: mongoose.Schema.Types.Mixed
    },
    capabilities: {
        type: mongoose.Schema.Types.Mixed
    }   
}
var TeamSchema = mongoose.Schema(Schema);

var Team = module.exports = mongoose.model('Teams',TeamSchema);
