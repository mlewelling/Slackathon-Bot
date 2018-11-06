'use strict';
const auth = require('./../auth/authTokens.js');
const dialogflow = require('dialogflow');
const apiai = require('apiai');

module.exports = {

	getMessageResponse: function (sentMessage, callback) {

		var app = apiai(auth.dialogFlowSessionID);

		var request = app.textRequest(sentMessage, {
		    sessionId: '12345'
		});

		request.on('response', function(response) {
			//console.log(response);
		    return callback(response.result.fulfillment.speech);
		});

		request.on('error', function(error) {
			console.log('im an error!!!');
		    console.log(error);
		});

		request.end();
	}
}