const express = require("express")
const User = require("../models/user.model")
const router = express.Router();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const loginUtil = require("../utils/login");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((err, user) => {
        done(err,user);
    })
})

passport.use(
    new LocalStrategy({usernameField:"email"}, (email, password, cb) => {
        User.findOne({email: email})
        .then(user => {
            if(!user) {
                return cb(false, null, {message: "User does not exist"});
            }
            bcrypt.compare(password, user.password)
            .then((err, valid) => {
                if(err) throw err;
                if(valid) return cb(false, user);
                else cb(true, null, {message: "Passwords do not match"});
            })
        })
        .catch(err=>{
            return cb(true, null , {message: "Could not fetch user"});
        })
    })
)

router.route("/login").post((req,res) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return res.status(400).send({error: info.message});
        }
        if(!user){
            return res.status(400).send({error: info.message});
        }
        req.logIn(user, (err) => {
            if(err) return res.status(400).send({error: err});
            return req.status(200).json({msg: `logged in ${user.email}`})
        });
    })(req,res)
});
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

router.route("/profile").post(async (req, res) => {
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