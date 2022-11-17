var express = require('express');
var router = express.Router();
var utils = require("../utils");
var User = require("../models/user");
const { check, validationResult } = require('express-validator');

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('account');
});

router.post('/', utils.ensureAuthenticated, async function(req, res) {
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;
	await check('newPassword', 'Please enter a password!').notEmpty().run(req);
	await check('confirmPassword', 'Passwords do not match.').equals(req.body.newPassword).run(req);

	var errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash('error_msg', 'Passwords do not match.');
		res.redirect('/account');
	} else {
		User.comparePassword(oldPassword, res.locals.user.password, function(error, isMatch) {
			if (error) throw error;
			if (isMatch) {
				User.changePassword(res.locals.user, newPassword, function(err, user) {
					if (err) throw err;
					req.flash('success_msg', 'Successfully changed password.');
					res.redirect('/account');
				});
			} else {
				req.flash('error_msg', 'Incorrect password.');
				res.redirect('/account');
			}
		});
	}
});

module.exports = router;