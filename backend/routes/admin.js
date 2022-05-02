const Game = require("../models/game.model")
const User = require("../models/user.model")
const express = require("express")
const loginUtils = require("../utils/login");
const utils = require("../utils/utils");
const router = express.Router();
const fs = require("fs");

router.use((req,res,next) => {
    loginUtils.verifyJWT(req,res,next);
    next();
})
router.use((req,res,next) => {
    loginUtils.ensureAdmin(req,res,next);
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
        var state = JSON.parse(buffer);
        state["cur_event"] = cur_event;
        await fs.writeFile("../config/state.json", state);
        res.status(200).send({msg: "Successfully updated current event"})
    }   
    catch(err){
        res.status(400).send({error: "Unable to edit current event"});
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


module.exports = router;