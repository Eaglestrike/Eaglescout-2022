var mongoose = require('mongoose');
var mongoose_csv_export = require('mongoose-csv-export').default;
var observationForm = require('../observationForm');

var ObservationSchema = mongoose.Schema(observationForm.getObservationFormSchema());

var headers = Object.keys(observationForm.getObservationFormSchema());
headers.unshift('_id');

ObservationSchema.plugin(mongoose_csv_export, {
	headers: headers,
	delimiter: ','
});

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);

module.exports.createObservation = function(newObservation, callback) {
	newObservation.save(callback);
}