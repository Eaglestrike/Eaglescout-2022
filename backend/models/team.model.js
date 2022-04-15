const mongoose = require('mongoose');
var utils = require('../utils/utils');
var gameSummary = require(`../games/${utils.getCurrentGame()}/gameSummary`)

var Schema = {
    team: {
        type: String,
    },
    event: {
        type: String,
    },
    averages: {

    },
    capabilities: {

    }   
}
var gameAverage = gameSummary.getRobotAverageSchema();
var gameCapability = gameSummary.getRobotCapabilitySchema();
for(category in gameAverage){
    Schema['averages'][category] = gameAverage[category];
}
for(category in gameCapability){
    Schema['capabilities'][category] = gameCapability[category];
}

var TeamSchema = mongoose.Schema(Schema);

var Team = module.exports = mongoose.model(`Teams${utils.getCurrentGame()}`,TeamSchema);
