const Game = require("../models/game.model")
const User = require("../models/user.model")
const express = require("express")
const loginUtils = require("../utils/login");
const utils = require("../utils/utils");
const router = express.Router();
const fs = requrie("fs");

router.use((req,res,next) => {
    loginUtils.verifyJWT(req,res,next);
    if(req.user.roles != 'admin') res.status(403).send({'error': 'Insufficient permissions'})
    next();
})

router.route("/game")
.get(async (req,res) => {
    var curGame =  (req.body.year) ? req.body.year : await utils.getCurrentGame();
    var game = await Game.findOne({year: curGame});
    if(game) res.status(200).json(game);
    res.status(400).send({error: "Could not fetch game"})
})
.post(async (req,res) => {
    var body = req.body;
    if(await Game.findOne({year: body.year}))
        return res.status(400).send({error: `Already game of year ${body.year} found`});
    var game = new Game({...req.body, filters: {}});
    try{
        await game.save();
        res.status(200).send({msg: "Successfully created a new game!"})
    }
    catch (err) {
        res.status(400).send({error: "Failed to create a new game"});
    }
})

router.route("/game/edit/:id")
.post(async (req,res) => {
    var body = req.body;
    try {
        var game = await Game.findByIdAndUpdate(req.params.id, body);
        if(!game) res.status(400).send({error: "Unable to find game with that id"});
        res.status(200).send({msg: "Successfully edited game"});
    }
    catch(err){
        res.status(400).send({error: "Unable to save edited observation"});
    }
})

router.route("/game/:id")
.delete(async (req,res) => {
    try {
        var game = await Game.findByIdAndRemove(req.params.id);
        if(!game) res.status(400).send({error: "Unable to find game with that id"});
        res.status(200).send({msg: "Successfully deleted game"});
    }
    catch {
        res.status(400).send({error: "Unable to delete game"});
    }
})

router.route("/events")
.get(async (req, res) => {
    var event = (req.body.event) ? req.body.event : await utils.getCurrentEvent();
    res.status(200).send({cur_event: event});
})
.post(async (req, res) => {
    var cur_event = req.body.event;
    try {
        var buffer = await fs.readFile("../config/state.json");
        var state = buffer.json();
        state["cur_event"] = cur_event;
        await fs.writeFile("../config/state.json", state);
        res.status(200).send({msg: "Successfully updated current event"})
    }   
    catch(err){
        res.status(400).send({error: "Unable to edit current event"});
    }
})

router.route("/game/year")
.get(async (req, res) => {
    var event = (req.body.year) ? req.body.year : await utils.getCurrentGame();
    res.status(200).send({cur_game: event});
})
.post(async (req, res) => {
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

router.route("/users")
.get(async (req, res) => {
    try {
        var users = await User.find();
        if(!users) res.status(400).send({error: "Unable to fetch users"});
        res.status(200).send({users: users});
    }  
    catch(err) {
        res.status(400).send({error: "Unable to fetch users"});
    }
})

router.route("/users/:id")
.get(async (req, res) => {
    try {
        var user = await User.findById(req.params.id);
        if(!user) res.status(400).send({error: "Unable to find user with that id"});
        res.status(200).send({user: user});
    }  
    catch(err) {
        res.status(400).send({error: "Unable to fetch users"});
    }
})
.post(async (req,res) => {
    try {
        var user = await User.findByIdAndUpdate(req.params.id,req.body);
        if(!user) res.status(400).send({error: "Unable to find user with that id"});
        res.status(200).send({msg: "Successfully updated user"});
    }  
    catch(err) {
        res.status(400).send({error: "Unable to find user with that id"});
    }
})
.delete(async (req,res) => {
    try {
        var user = await User.findByIdAndDelete(req.params.id);
        if(!user) res.status(400).send({error: "Unable to find user with that id"});
        res.status(200).send({msg: "Successfully deleted user"});
    }
    catch(err) {
        res.status(400).send({error: "Unable to find user with that id"});
    }
})

router.route("/users/roles/edit/:id")
.post(async (req,res) => {
    try {
        var user = await User.findById(req.params.id);
        if(!user) res.status(400).send({error: "Could not update role of that user"})
        user["role"] = req.body.role;
        await user.save();
        res.status(200).send({msg: "Updated role of user"})
    }
    catch {
        res.status(400).send({error: "Could not update role for that user"})
    }
})

module.exports = router;