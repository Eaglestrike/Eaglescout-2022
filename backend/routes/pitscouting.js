const Game = require("../models/game.model")
const PitScouting = require("../models/pitscouting.model")
const express = require("express")
const loginUtils = require("../utils/login");
const utils = require("../utils/utils");
const router = express.Router();

router.use((req,res,next) => {
    loginUtils.verifyJWT(req,res,next);
    next()
})

router.route("/list")
.get(loginUtils.ensureUser, async (req,res) => {
    var list = await PitScouting.find();
    res.status(200).send({msg: "Success", list: list});
})
