var mongoose = require('mongoose');

var Game = {
    /*
    each observation form should be of the structure
     */
    name: {
        type: String,
        index: true,
        unique: true
    },
    observationForm: { 
        type: mongoose.Schema.Types.Mixed
    },
    pitScoutingForm: {
        type: mongoose.Schema.Types.Mixed
    },
    filters: {
        type: mongoose.Schema.Types.Mixed
    },
}