const firebase = require('firebase');

module.exports = {

	addFirebaseData: function (dataObject, callback) {

		var firestore = firebase.firestore();

  		firestore.settings({ 
			timestampsInSnapshots: true
		});

		firestore.collection("UserQuestions").doc(dataObject.messageTS).set(dataObject);

		return callback(dataObject);

	},

	getFirebaseData: function (callback) {

		var firestore = firebase.firestore();

		firestore.settings({ 
			timestampsInSnapshots: true
		});

		var userQuestionsRef = firestore.collection('UserQuestions');

		var queryResults = [];

		var query = userQuestionsRef.get()
		  .then(snapshot => {
		    snapshot.forEach(doc => {
		    	queryResults.push(doc.data());
		    });
		    return callback(queryResults);
		  })
		  .catch(err => {
		    console.log('Error getting documents', err);
		  });

	 	return callback(queryResults);

	},

	updateFirebaseReminder: function (dataObject, callback) {
		var firestore = firebase.firestore();

		firestore.settings({ 
			timestampsInSnapshots: true
		});

		var userQuestionsRef = firestore.collection('UserQuestions');

		//var questionToUpdateRef = userQuestionsRef.where('messageTS', '==', `${uniqueId}`);

		var questionToUpdateRef = userQuestionsRef.doc(dataObject.messageTS);

		var questionToUpdate = questionToUpdateRef.set(dataObject);
	}

}