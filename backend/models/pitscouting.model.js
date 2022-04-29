const mongoose = require('mongoose')

var pitScouting = {
    year: {
        type: Number
    },
    event: {
        type: String
    },
    team: {
        type: Number
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
}

var pitScoutingSchema = mongoose.Schema(pitScouting);
var PitScouting = module.exports = mongoose.Model("PitScouting", pitScoutingSchema);