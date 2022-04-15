module.exports = {
    //Points from each game objective
    //should be auto/teleop/endgame_objective
    points: {
        'auto_taxi': {'yes': 2, 'no': 0},
        'auto_low_goals': 2,
        'auto_high_goals': 4,
        'teleop_low_goals': 1,
        'teleop_high_goals': 2,
        'endgame_climb': {'low_bar': 4, 'mid_bar': 6, 'high_bar': 10, 'traverse_bar': 15,'no_attempt': 0, 'failed': 0},
    }
}