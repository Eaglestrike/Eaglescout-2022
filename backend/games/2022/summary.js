module.exports = { 

    /* 
    Types of input
    number: takes number adds number
    string_arr: append string array and remove duplicate
    (dictionary): to compare strings to each other, key is input, value is value
    match_list: record matches performed
    */
    capabilities: {
        'auto_taxi': {'yes': 1, 'no': 0},
        'auto_low_goals': 'number',
        'auto_high_goals': 'number',
        'teleop_low_goals': 'number',
        'teleop_high_goals': 'number',
        'teleop_eject_balls': 'string_arr',
        'teleop_shoot_balls': 'string_arr',
        //0 is slow, 1 is medium, 2 is fast
        'speed': {'slow': 0, 'medium': 1, 'fast': 2},
        //climb is 0 is none, 1 is low, 2 is mid, 3 is high, 4 is traversal
        'endgame_climb': {'low_bar': 1, 'mid_bar': 2, 'high_bar': 3, 'traverse_bar': 4,'no_attempt': 0, 'failed': -1},
        'teleop_robot_died': 'match_list',
        'time_on_defense': 'match_list',
    },
}