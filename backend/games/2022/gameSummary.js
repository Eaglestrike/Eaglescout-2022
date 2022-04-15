var game = require("./game");
/*************
 * PLAN FOR NOW:
 * 
 * NUMBERS WORTH AVERAGING
 * - everything in game.points
 * - driver skill
 * - speed
 * - endgame_climb_time
 * 
 * STUFF WORTH KEEPING A MAX OF:
 * - everything in game.points
 * - driver skill
 * - speed
 * - teleop_robot_died
 * - time_on_defense
 * - teleop_eject_balls
 * - teleop_shoot_balls
 * - 
 * 
 ************/
var robotAverage = {
    'driver_skill': 1,
    'speed': {'slow': 0, 'medium': 1, 'fast': 2},
    'endgame_climb_time': 1
}
for(var category in game.points){
    robotAverage[category] = game.points[category];
}
/* 
    Types of input
    number: takes number adds number
    string_arr: append string array and remove duplicate
    (dictionary): to compare strings to each other, key is input, value is value
    match_list: record matches performed
*/
var robotCapabilities = {
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
    'driver_skill': 'number',
    'teleop_robot_died': 'match_list',
    'time_on_defense': 'match_list',
}

const getRobotAverageSchema = () =>{
    var toReturn = {};
    for(var category in robotAverage){
        toReturn[category] = {
            type: Number,
        }
    }
    return toReturn;
}
const getRobotCapabilitySchema = () =>{
    var toReturn = {};
    for(var category in robotCapabilities){
        if(robotCapabilities[category] == 'match_list' || robotCapabilities[category] == 'string_arr'){
            toReturn[category] = {
                type: Array,
            }
        }
        else if(robotCapabilities[category] == 'number'){
            toReturn[category] = {
                type: Number,
            }
        }
        else if(typeof(robotCapabilities[category]) == 'object'){
            toReturn[category] = {
                type: String,
            }
        }
    }
    return toReturn;
}
module.exports = { 
    getRobotAverageSchema: getRobotAverageSchema,
    getRobotCapabilitySchema: getRobotCapabilitySchema,
}