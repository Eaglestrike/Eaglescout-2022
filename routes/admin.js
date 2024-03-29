const express = require("express");

const router = express.Router();
const { body, validationResult, check } = require("express-validator");

const User = require("../models/user");
const Observation = require("../models/observation");
const utils = require("../utils");
const TBA = require("../TBA");
const fs = require("fs");

router.get("/register", utils.ensureAdmin, function(req, res) {
  res.render("register");
});

router.get("/bulkimport", utils.ensureAdmin, function(req, res) {
  res.render("bulkimport");
});

router.get("/schedule",utils.ensureAdmin, function(req,res) {
  
})

router.get("/clearobservations", utils.ensureAdmin, function(req, res) {
  var cur_events = req.query.events;
  //default is to remove current event?
	if(cur_events == undefined) cur_events = utils.getCurrentEvent();
	cur_events = cur_events.split(',');
	var filter = {
		$or: [
		]
	};
	for(var event in cur_events){
		if(cur_events[event] == "all"){
			filter = {};
			break;
		}
		filter.$or.push({'competition': cur_events[event]});
	}
  Observation.remove(filter, (err, response) => {
    req.flash(
      "success_msg",
      `Successfully cleared ${response.n} observations.`
    );
    res.redirect("/admin");
  });
});

router.post("/register", utils.ensureAdmin,
  body("email").isEmail(),
  body("password").notEmpty(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
(req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("register", {
      errors: errors
    });
  } else {
    User.find(
      {
        email: email
      },
      function(err, users) {
        if (users.length > 0) {
          req.flash("error_msg", "Account already exists!");
          res.redirect("/admin/register");
        } else {
          var newUser = new User({
            email: email,
            password: password,
            admin: req.body.admin == "on"
          });

          User.createUser(newUser, function(err, user) {
            if (err) throw err;
          });

          req.flash("success_msg", "Successfully registered user.");
          res.redirect("/admin/register");
        }
      }
    );
  }
});

router.post("/bulkimport", utils.ensureAdmin, async function(req, res) {
  var textbox = req.body.bulkimport;
  var password = req.body.password;

  await check("password", "Please enter a password!").notEmpty.run(req);

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error_msg", "Please enter a password!");
    res.redirect("/admin/bulkimport");
  } else {
    var emails = textbox.split("\n");

    for (var email in emails) {
      while (emails[email].endsWith("\r")) {
        emails[email] = emails[email].slice(0, -1);
      }

      if (emails[email].trim() == "") {
        continue;
      }

      var userSearch = await User.find({
        email: emails[email]
      })

      if(userSearch.length == 0) {
        var newUser = new User({
          email: emails[email],
          password: password,
          admin: false
        });

        User.createUser(newUser, function(err, user) {
          if (err) throw err;
        });
      }

    }

    req.flash(
      "success_msg",
      'Successfully bulk registered users. Their password is "' +
        password +
        '".'
    );
    res.redirect("/admin");
  }
});

router.get("/userlist", utils.ensureAdmin, function(req, res) {
  User.find({}, function(err, users) {
    res.render("userlist", {
      users: users
    });
  });
});

router.get("/", utils.ensureAdmin, function(req, res) {
  TBA.getEvents(events => {
    res.render("admin", {
      events: events
    });
  });
});

router.get("/event", utils.ensureAdmin, function(req, res) {
  TBA.getEvents(events => {
    res.render("event", {
      events: events
    });
  });
});

router.get("/deluser/:id", utils.ensureAdmin, function(req, res) {
  if (res.locals.user.id == req.params.id) {
    req.flash(
      "error_msg",
      "You cannot delete your own account! Did NOT delete user!"
    );
    res.redirect("/admin/edituser/" + req.params.id);
    return;
  }
  User.remove(
    {
      _id: req.params.id
    },
    function(err) {
      if (err) throw err;
      req.flash("success_msg", "Successfully deleted user.");
      res.redirect("/admin/userlist");
    }
  );
});

router.get("/edituser/:id", utils.ensureAdmin, function(req, res) {
  User.findOne(
    {
      _id: req.params.id
    },
    function(err, user) {
      res.render("edituser", {
        id: user["id"],
        email: user["email"],
        admin: user["admin"] ? 'checked="checked"' : ""
      });
    }
  );
});

router.post("/toggleadmin/:id", utils.ensureAdmin, function(req, res) {
  User.findOne(
    {
      _id: req.params.id
    },
    function(err, user) {
      User.toggleAdmin(user, req.body.admin == "on", function(err, user) {
        if (err) throw err;
        req.flash("success_msg", "Successfully toggled admin state of user.");
        res.redirect("/admin/edituser/" + req.params.id);
      });
    }
  );
});

router.post("/changepassword/:id", utils.ensureAdmin, function(req, res) {
  User.findOne(
    {
      _id: req.params.id
    },
    async function(err, user) {
      var newPassword = req.body.newPassword;
      var confirmPassword = req.body.confirmPassword;
      await check("newPassword", "Please enter a password!").notEmpty().run(req);
      await check("confirmPassword", "Passwords do not match.").equals(req.body.newPassword).run(req);
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("error_msg", "Passwords do not match.");
        res.redirect("/admin/edituser/" + req.params.id);
      } else {
        User.changePassword(user, newPassword, function(err, user) {
          if (err) throw err;
          req.flash("success_msg", "Successfully changed password of user.");
          res.redirect("/admin/edituser/" + req.params.id);
        });
      }
    }
  );
});

router.post("/event", utils.ensureAdmin, body("event").notEmpty(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    TBA.getEvents(events => {
      res.render("event", {
        events: events,
        errors: errors.array()
      });
    });
  } else {
    fs.readFile("./config/state.db", function(err, buf) {
      if (err) throw err;

      var json = JSON.parse(buf.toString());
      var event = req.body.event;
      json["current_event"] = event;

      fs.writeFile("./config/state.db", JSON.stringify(json), function(
        error,
        data
      ) {
        if (error) throw error;

        req.flash("success_msg", "Successfully changed event.");
        res.redirect("/admin/event");
      });
    });
  }
});

module.exports = router;