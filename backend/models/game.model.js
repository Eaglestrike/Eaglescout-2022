var mongoose = require('mongoose');

var Game = {
    /*
    each observation form should be of the structure
     */
    year: {
        type: Number,
        index: true,
        unique: true
    },
    observationForm: { 
        type: mongoose.Schema.Types.Mixed
    },
    filters: {
        type: mongoose.Schema.Types.Mixed
    },
}