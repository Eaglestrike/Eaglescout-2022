var secrets;
try {
	secrets = require('../config/secrets.json');
} catch (e) {
	console.error(e);
	secrets = {};
}

module.exports = {
	TBA_API_KEY: secrets.TBA_API_KEY || "TEST_TBA_API_KEY"
}