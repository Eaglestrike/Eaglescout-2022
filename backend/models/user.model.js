var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/*
* role: "admin", "user", "viewer?"
*/


var UserSchema = mongoose.Schema({
	email: {
		type: String,
		index: true
	},
	name: {
		first: {
			type: String
		},
		last: {
			type: String
		}
	},
	password: {
		type: String
	},
	role: {
		type: String,
		enum: ["admin", "user", "viewer"],
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
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
