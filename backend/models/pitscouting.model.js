const mongoose = require('mongoose')

var pitScouting = {
    userId: {
        type: String
    },
    game: {
        type: String
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

var PitScoutingSchema = mongoose.Schema(pitScouting);

var PitScouting = module.exports = mongoose.model('PitScouting', PitScoutingSchema);