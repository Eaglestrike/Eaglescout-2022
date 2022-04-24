const express = require("express")
const User = require("../models/user.model")
const router = express.Router();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const loginUtils = require("../utils/login");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets")

router.route("/login").post((req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            res.status(400).send({error: "User does not exist"});
        }
        bcrypt.compare(password, user.password)
        .then((err, valid) => {
            if(err) throw err;
            if(valid){
                jwt.sign(user,
                secrets.JWT_KEY,
                {expiresIn: 10000000},
                (err, token) =>{
                    if(err) res.status(400).send({error: "Could not use jwt"});
                    else res.status(200).send({msg: "Success", token: token})
                })
            } 
            else res.status(400).send({error: "Passwords do not match"});
        })
    })
    .catch(err=>{
        res.status(400).send({error: "Could not fetch user"});
    })
})

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
    await loginUtil.sendConfirmationEmail(user.email, confirmation)
})
router.route("/signup/:code").post(async (req,res) => {
    var code = req.params.code
    curUser = await User.findOne({confirmationCode: code})
    if(curUser == null){
        res.status(400).send({ error: `Could not find user with confirmation code ${code}`})
    }
    curUser.status = "active";
    await curUser.save();
    res.status(200).send({"msg": "Success! Your email has been authenticated"})
})

router.route("/profile").post(loginUtils.verifyJWT,async (req, res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    var user = await User.find({email: body.email});
    if(!user){
        return res.status(400).send({ error: "User does not exist!" });
    }
    if(!(req.body.firstName && req.body.lastName)){
        return res.status(400).send({error: "firstName and "})
    }
    if(req.body.firstName){
        user.name.first = req.body.firstName;
    }
    if(req.body.lastName){
        user.name.last = req.body.lastName;
    }
    await user.save();
})
router.route("/resetpassword").post(async (req, res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    var user = await User.find({email: body.email});
    if(!user){
        return res.status(400).send({ error: "User does not exist!" });
    }
    var valid = await bcrypt.compare(user.password, body.password);
    if(valid){
        user.password = body.newPassword()
    }
})
router.route("/:id").get(async (req, res) => {
    var user = await User.findById(id);
    if(user == null){
        res.status(400).send({"error": "Could not find user"});
    }
    res.status(200).send({"user": user});
})
module.exports = router;