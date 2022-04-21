const express = require("express")
const User = require("../models/user.model")
const router = express.Router();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const loginUtil = require("../utils/login");

router.route("/login").get(async (req,res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({error: "No email or password"})
    }
    var user = await User.findOne({email: body.email});
    if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
          res.status(200).json({ message: "Valid password" });
        } else {
          res.status(400).json({ error: "Invalid Password" });
        }
    } else {
        res.status(401).json({ error: "User does not exist" });
    }
})
//plan for now, send 
router.route("/signup").post(async (req,res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    var foundUser = await User.findOne({email: body.email});
    if(foundUser != null) {
        return res.status(400).send({error: "An account with this email already exists!"});
    }
    var confirmation = utils.genConfirmationCode(5)
    var user = {
        ...body,
        "role": "viewer",
        "confirmationCode": confirmation,
    }
    user.password = await bcrypt.hash(user.password, 10);
    var newUser = new User(user);
    newUser.save();
    loginUtil.sendConfirmationEmail(user.email, confirmation)
})

router.route("/resetpassword").post(async (req, res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    var user = await User.find({email: body.email});
    if(!user){
        return res.status(401).send({ error: "User does not exist!" });
    }
    
})
module.exports = router;