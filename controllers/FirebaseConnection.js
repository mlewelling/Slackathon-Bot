var admin = require('firebase-admin');

var serviceAccount = require('path/to/serviceAccountKey.json');


module.exports = {

	addFirebaseData: function (dataObject, callback) {
		
		admin.initializeApp({
		  credential: admin.credential.cert(serviceAccount),
		  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
		});




	}

	readFirebaseData: function (data_timestamp) {

	}

}