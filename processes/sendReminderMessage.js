const cron = require('node-cron');
const firebaseController = require('../controllers/FirebaseConnection.js');
const firebase = require('firebase');
const moment = require('moment')

var serviceAccount = require("../auth/service-account.json");
firebase.initializeApp(serviceAccount);

console.log("moment time is");
console.log(new moment());


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

		if ( timeDifference >= 1 ) {
			//send message to bot
		}

	});
});

 /*
cron.schedule('* * * * *', function(){


  

});
*/