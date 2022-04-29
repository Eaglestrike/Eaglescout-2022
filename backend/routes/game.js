const express = require("express")
const router = express.Router();
const Game = require("../models/game.model");
const loginUtils = require("../utils/login")
const utils = require("../utils/utils")

router.use((req,res,next) =>{
    loginUtils.ensureJWT(req,res,next);
})


router.route("/current")
.get(loginUtils.ensureUser, async (req,res) => {
    var event = await utils.getCurrentGame();
    res.status(200).send({cur_game: event});
})
.post(loginUtils.ensureAdmin, async(req,res) => {
    var cur_event = req.body.year;
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
        year: body.year,
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

router.route("/game/:year")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({year: req.params.year});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", game: game});
})
.post(loginUtils.ensureAdmin, async (req, res) => {
    var body = req.body;
    var game = await Game.findOne({year: req.params.year});
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    game.observationForm = (body.observationForm) ? body.observationForm : game.observationForm;
    game.pitScoutingForm = (body.pitScoutingForm) ? body.pitScoutingForm : game.pitScoutingForm;
    game.filters = (body.filters) ? body.filters : game.pitScoutingForm;
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})
.delete(loginUtils.ensureAdmin, async (req,res) => {
    var game = await Game.findOneAndDelete({year: req.params.year});
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    res.status(200).send({msg: "Successfully deleted that year's game"});
})


router.route("/observationform/:year")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({year: req.params.year});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", form: game.observationForm});
})
.post(loginUtils.ensureAdmin, async (req, res) => {
    var body = req.body;
    var game = await Game.findOne({year: req.params.year});
    if(!game) return res.status(400).send({error: "Could not find game of that year"});
    game.observationForm = body.observationForm;
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})

router.route("/pitscoutingform/:year")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.find({year: req.params.year});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(400).send({msg: "Success", form: game.pitScoutingForm});
})
.post(loginUtils.ensureAdmin, async (req,res) => {
    var body = req.body;
    var game = await Game.findOne({year: req.params.year});
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

router.route("/filters/:year")
.get(loginUtils.ensureUser, async (req,res) => {
    var game = await Game.findOne({year: req.params.year});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    res.status(200).send({msg: "Success, Found filters", filters: game.filters});
})
.post(loginUtils.ensureAdmin, async (req, res) => {
    var game = await Game.findOne({year: req.params.year});
    if(!game) return res.status(400).send({error: "Unable to find game"});
    game.filters = req.body.filters;
    try {
        await game.save();
        res.status(200).send({msg: "Success"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to save game"});
    }
})