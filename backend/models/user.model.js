var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/*
* role: "admin", "moderater", "user", "viewer?"
*/
var UserSchema = mongoose.Schema({
	email: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String
	},
	name: {
		first: {
			type: String,
			default: "",
		},
		last: {
			type: String,
			default: "",
		}
	},
	role: {
		type: String,
		enum: ["owner","admin","moderator", "user", "viewer"],
		default: "viewer"
	},
	status: {
		type: String,
		enum: ["pending", "active"],
		default: "pending"
	},
	confirmationCode: {
		type: String,
		unique: true,
	},
	resetPasswordToken: {
		token: {
			type: String,
			default: ""	
		},
		expiresIn: {
			type: Number,
			default: 0
		}
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
