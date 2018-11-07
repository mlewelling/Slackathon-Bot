const firebaseController = require('../controllers/FirebaseConnection.js');
const firebase = require('firebase');

var serviceAccount = require("../auth/service-account.json");
firebase.initializeApp(serviceAccount);

var cron = require('node-cron');
 
cron.schedule('* * * * *', function() {
  
	

  
});