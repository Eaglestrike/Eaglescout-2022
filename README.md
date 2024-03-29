# Eaglescout
## About
Eaglescout is a web-based scouting system for FRC Team 114 (Eaglestrike). It is written in node.js, with packages express.js and passport.js. Styling is done in Handlebars, HTML, and CSS. Database is MongoDB.

Latest development year: 2022.

## Dependencies
* node.js
* NPM (node package manager)
* MongoDB

## Installation
To clone the repository:
```bash
git clone https://github.com/Eaglestrike/Eaglescout.git
```
To install node modules:
```bash
npm install
```

To install node modules:
```bash
node app.js
```

## Example Observation Form for `observationForm.js`
```javascript
var observationFormSchema = {
	user: {
		type: String,
		input: null
	},
	competition: {
		type: String,
		input: "dropdown",
		placeholder: "Select a competition",
		title: "Current competition",
		subtitle: "If you're at a practice match, select \"Practice Match\""
	},
	team: {
		type: String,
		input: "number",
		placeholder: "Team number only",
		title: "Team Number",
		subtitle: "This is the team number that you are observing"
	},
	test_dropdown: {
		type: String,
		input: "dropdown",
		data: {
			"key1": "Value 1",
			"key2": "Value 2"
		},
		placeholder: "This is a test!",
		title: "Test for dropdown",
		subtitle: "This is subtitle for dropdown"
	},
	test_mult: {
		type: String,
		input: "multiple_choice",
		data: {
			"key1": "Value 1",
			"key2": "Value 2"
		},
		title: "Test for multiple choice",
		subtitle: "This is subtitle for multiple choice"
	},
	test_long_text: {
		type: String,
		input: "long_text",
		title: "Test for long text",
		subtitle: "This is subtitle for long text"
	},
	test_short_text: {
		type: String,
		input: "short_text",
		placeholder: "This is a placeholder",
		title: "Test for short text",
		subtitle: "This is subtitle for short text"
	},
	test_checkbox: {
		type: String,
		input: "checkbox",
		placeholder: "This is a test!",
		data: {
			"check1": "Check 1",
			"check2": "Check 2",
			"check3": "Check 3",
			"check4": "Check 4"
		},
		title: "Test for checkbox",
		subtitle: "This is subtitle for checkbox"
	},
	test_number: {
		type: String,
		input: "number",
		placeholder: "This is a number",
		title: "Test for number",
		subtitle: "This is subtitle for number"
	},
	test_slider: {
		type: String,
		input: "slider",
		data: {
			"min": 90,
			"max": 100
		},
		placeholder: "This is a slider",
		title: "Test for slider",
		subtitle: "This is subtitle for slider"
	}
}
```

## Default Admin User
Username: `admin@team114.org`
Password: `team114`

You can change this in `models/user.js` under the `createAdminUserIfNotExists` function. Alternatively, you can create a new admin user via the admin panel and delete the old one.

Default port: 3000

# Secrets
You need a secrets.json file to run the app. It contains API keys and other secrets needed to run this app. Contact a captain for the file.

## Making Changes
* To make changes, first run `ssh dev@team114.org`
* When prompted for a password, contact a captain for the proper credentials.
* Clone the repository, make any changes you wish, and commit them to a separate branch (committing to main is not recommended for any significant changes).
	* Push this local branch
* While your ssh connection remains active, navigate to `/var/www/scout` to adjust the scouting website, and `/var/www/site` to change the team114.org website.
* Run `git pull origin/{branch_name}` to bring your latest branch to the server.
* Changes will be immediately reflected on the website.
* After your testing is finished, don't forget to pull the main or other stable branch, so your tests don't remain on the official website.
