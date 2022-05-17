const express = require("express")
const router = express.Router();
const Game = require("../models/game.model");
const loginUtils = require("../utils/login")
const utils = require("../utils/utils")


const createDefaultGame = async () => {
    var games = await Game.find();
    if(games.length) return;
    var game = {
        name: "template",
        observationForm: {    
            autoComments: {
                input: "longText",
                category: "auto",
                title: "[Auto] Extra comments",
                subtitle: "Write anything that might be noteworthy about auto here." 
            },
            teleopComments: {
                input: "longText",
                category: "teleop",
                title: "[Teleop] Extra comments",
                subtitle: "Write anything that might be noteworthy about teleop here." 
            },
            endgameComments: {
                input: "longText",
                category: "endgame",
                title: "[Endgame] Extra comments",
                subtitle: "Write anything that might be noteworthy about endgame here." 
            },
            overallComments: {
                input: "longText",
                category: "other",
                title: "Any other comments",
                subtitle: "Write anything that might be noteworthy about the robot here." 
            }

        },
        pitScoutingForm: {
            drivebase: {
                input: "checkbox",
                data: {
                    "westcoast": "Westcoast",
                    "swerve": "Swerve",
                    "hdrive": "H-Drive",
                    "mecanum": "Mecanum",
                    "other": "Other"
                },
                title: "What type of drivebase do they have?"
            },
            drivebaseMotors: {
                input: "checkbox",
                data: {
                    "falcon500": "Falcon 500s",
                    "neo550": "Neo 550s",
                    "neos": "Neos",
                    "cim": "CIMs",
                    "775pro": "775 Pros",
                    "other": "Other",
                },
                title: "What type of drivebase motors do they have?"
            }
        },
        filters: {

        }
    }
}

router.use((req,res,next) =>{
    loginUtils.ensureJWT(req,res,next);
})


router.route("/current")
.get(loginUtils.ensureUser, async (req,res) => {
    var event = await utils.getCurrentGame();
    res.status(200).send({cur_game: event});
})
.post(loginUtils.ensureAdmin, async(req,res) => {
    var cur_game = req.body.game;
    try {
        var buffer = await fs.readFile("../config/state.json");
        var state = buffer.json();
        state["cur_game"] = cur_game;
        await fs.writeFile("../config/state.json", state);
        res.status(200).send({msg: "Successfully updated current game year"})
    }   
    catch(err){
        res.status(400).send({error: "Unable to edit current game year"});
    }
})

router.route("/new")
.post(loginUtils.ensureAdmin, async (req,res) => {
    var body = req.body;
    var observationForm = body.observationForm ? body.observationForm : {};
    var pitScoutingForm = body.pitScoutingForm ? body.pitScoutingForm : {};
    var filters = (body.filters) ? body.filters : {};
    var game = {
        name: body.name,
        observationForm: observationForm,
        pitScoutingForm: pitScoutingForm,
        filters: filters
    }
    try{
        var newGame = new Game(game);
        newGame.save();
        res.status(200).send({msg: "Successfully created and saved game"});
    }
    catch(err) {
        return res.status(400).send({error: "Could not create new game"});
    }
})

router.route("/name/:name")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", game: game});
})
.put(loginUtils.ensureAdmin, async (req, res) => {
    var body = req.body;
    var game = await Game.findOne({year: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    game.observationForm = (body.observationForm) ? body.observationForm : game.observationForm;

    game.pitScoutingForm = (body.pitScoutingForm) ? body.pitScoutingForm : game.pitScoutingForm;
    if(body.filters){
        for(var filter in body.filters){
            game.filters[filter] = body.filters[filter];
        }
    }
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})
.delete(loginUtils.ensureAdmin, async (req,res) => {
    var game = await Game.findOneAndDelete({name: req.params.name});
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    res.status(200).send({msg: "Successfully deleted that year's game"});
})


router.route("/observationform/:name")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", form: game.observationForm});
})
.put(loginUtils.ensureAdmin, async (req, res) => {
    var body = req.body;
    var game = await Game.findOne({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    game.observationForm = body.observationForm;
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})

router.route("/pitscoutingform/:name")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", form: game.pitScoutingForm});
})
.put(loginUtils.ensureAdmin, async (req,res) => {
    var body = req.body;
    var game = await Game.findOne({name: req.params.name});
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    game.pitScoutingForm = body.pitScoutingForm;
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})

router.route("/filters/:name")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.findOne({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(200).send({msg: "Success, Found filters", filters: game.filters});
})
.put(loginUtils.ensureAdmin, async (req, res) => {
    var game = await Game.findOne({name: req.params.name});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    if(body.filters){
        for(var filter in req.body.filters){
            game.filters[filter] = req.body.filters[filter];
        }
    }    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})

module.exports = router;