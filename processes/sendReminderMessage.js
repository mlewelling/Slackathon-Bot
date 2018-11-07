const cron = require('node-cron');
const firebaseController = require('../controllers/FirebaseConnection.js');
const firebase = require('firebase');
const auth = require('../auth/authTokens.js');
const moment = require('moment');
const sendFollowUp = require('../controllers/SendFollowUp.js');
var serviceAccount = require("../auth/service-account.json");
const { WebClient } = require('@slack/client');
firebase.initializeApp(serviceAccount);


cron.schedule('* * * * *', function() {

	const token = auth.oauthToken;
	const webClient = new WebClient(token);

	firebaseController.getFirebaseData(function(response) {
	    //console.log("Data added to firestore:")
	    //console.log(response);

	  	response.forEach(doc => {
			console.log(`Document:\nText=${doc.questionText} TS=${doc.timeStamp.toDate()}`);

			var documentTime = moment(doc.timeStamp.toDate());
			var currentTime = new moment();

			var timeDifferenceInMinutes = currentTime.diff(documentTime, 'minutes');

			console.log("time difference in minutes");
			console.log(timeDifferenceInMinutes);

			const data = {
				questionText: doc.questionText,
				messageTS: doc.messageTS,
				questionUser: doc.questionUser,
				timeStamp: doc.timeStamp,
				reminderSent: true
			}

			if ( timeDifferenceInMinutes >= 1 && doc.reminderSent == false ) {
				sendFollowUp.sendFollowUp(webClient, data, function(response) {
					console.log("data reminder successfully sent");
				});
				firebaseController.updateFirebaseReminder(data, function(response) {
					console.log("Updated reminder in firestore");
				});
				//need to update entry in database to have reminderSent to true
			}

		});
	});
});