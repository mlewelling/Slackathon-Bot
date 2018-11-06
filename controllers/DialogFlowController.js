const auth = require('./../auth/authTokens.js');
const dialogflow = require('dialogflow');


module.exports = {

	getMessageResponse: function (sentMessage) {
		const projectId = auth.dialogFlowClientID; 
		const sessionId = auth.dialogFlowSessionID; 

		const sessionClient = new dialogflow.SessionsClient();
		const sessionPath = sessionClient.sessionPath(projectId, sessionId);

		//********************************************

		// The text query request.
		const request = {
		  session: sessionPath,
		  queryInput: {
		    text: {
		      text: sentMessage,
		      languageCode: 'en-US',
		    },
		  },
		};


		sessionClient.detectIntent(request)
		  .then(responses => {
		    console.log('Detected intent');
		    const result = responses[0].queryResult;
		    console.log(`  Query: ${result.queryText}`);
		    console.log(`  Response: ${result.fulfillmentText}`);
		    if (result.intent) {
		      console.log(`  Intent: ${result.intent.displayName}`);
		    } else {
		      console.log(`  No intent matched.`);
		    }
		  })
		  .catch(err => {
		    console.error('ERROR:', err);
		  });
	}


	

}