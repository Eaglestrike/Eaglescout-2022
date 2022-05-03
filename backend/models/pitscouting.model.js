const mongoose = require('mongoose')

var pitScouting = {
    userId: {
        type: String
    },
    year: {
        type: Number
    },
    event: {
        type: String
    },
    team: {
        type: String
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    }
}

var pitScoutingSchema = mongoose.Schema(pitScouting);
var PitScouting = module.exports = mongoose.Model("PitScouting", pitScoutingSchema);