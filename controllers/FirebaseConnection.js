const firebase = require('firebase');

module.exports = {

	addFirebaseData: function (dataObject, callback) {

		var firestore = firebase.firestore();

  		firestore.settings({ 
			timestampsInSnapshots: true
		});

		firestore.collection("UserQuestions").add(dataObject);

		return callback(dataObject);

	},

	readFirebaseData: function (data_timestamp) {

	}

}