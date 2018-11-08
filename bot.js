const { RTMClient, WebClient } = require('@slack/client');
const auth = require('./auth/authTokens.js');
const dialogFlowController = require('./controllers/DialogFlowController.js');
const firebaseController = require('./controllers/FirebaseConnection.js');
const firebase = require('firebase');
const moment = require('moment');

var serviceAccount = require("./auth/service-account.json");
firebase.initializeApp(serviceAccount);
// OAuth token to be able to access the app
const token = auth.oauthToken;

//Start a RealTimeMessager Client session with the oauth token
const rtm = new RTMClient(token);
rtm.start();

// This uses the WebClient to search through any channels that the bot may be a part of
// This is mostly to announce the bot to each channel
const webClient = new WebClient(token);

var lastKnownBotQuestion = {
  questionText: "",
  messageTS: "",
  questionUser: "",
  timeStamp: new Date(),
  channelId: "",
  reminderSent: false,
  questionAnswer: ""
}


rtm.on('message', (message) => {

  console.log(message);

  if (message === undefined || message.text === undefined || message.text.length === 0) { 
    return; 
  }
  //Don't allow the bot to read it's own messages
  if ((message.subtype && message.subtype === 'bot_message') || (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  var messageText = message.text;
  messageText = messageText.toLowerCase();

  if ( messageText.includes("what") || messageText.includes("how") || messageText.includes("why") || messageText.includes("where") ||
       messageText.includes("hi") || messageText.includes("hello") || messageText.includes("?") || messageText.includes("food") || messageText.includes("yes") || messageText.includes("yeah") ||
       messageText.includes("good bot") ) {

    dialogFlowController.getMessageResponse(message.text, function(responseText) {
      
      if (responseText.length !== 0) {
        //TODO:
        // add if condition if there are any thread counts
        if ( message.thread_ts !== undefined ) {

          webClient.chat.postMessage({ channel: message.channel, text: responseText, thread_ts: message.thread_ts })
          .then((res) => {
            console.log('Message sent: ', res.ts);
          })
          .catch(console.error);
        } else {
          
          webClient.chat.postMessage({ channel: message.channel, text: responseText, thread_ts: message.ts })
          .then((res) => {
            console.log('Message sent: ', res.ts);
          })
          .catch(console.error);
          
        }
      } else {
        console.log("unknown question");

        var dataExistsInFirebase = false;

        firebaseController.getFirebaseDataFromText(messageText, function(response) {
          

          //console.log(responseText);

          //responseText = response.replace('["', '');
          //responseText = response.replace('"]', '');
          if (response.length > 0) {

            console.log("response from firestore on getting text message is ");

            var responseText = JSON.stringify(response)

            dataExistsInFirebase = true;

            if ( message.thread_ts !== undefined ) {
              webClient.chat.postMessage({ channel: message.channel, text: response, thread_ts: message.thread_ts })
              .then((res) => {
                console.log('Message sent: ', res.ts);
              })
              .catch(console.error);
            } else {
              
              webClient.chat.postMessage({ channel: message.channel, text: response, thread_ts: message.ts })
              .then((res) => {
                console.log('Message sent: ', res.ts);
              })
              .catch(console.error);
              
            }
          }
        })

        /*
        Add logic to first check database for self created question/answers, then add the data to firestore if it's not found
        */
        if ( messageText.includes("yes") || messageText.includes("yeah") ) {

          lastKnownBotQuestion.questionAnswer = messageText.replace("yes", "");

          firebaseController.addNewQuestionToFirebase(lastKnownBotQuestion, function(response) {
            console.log("Data updated in firestore with answer:");
            console.log(response);

            webClient.chat.postMessage({ channel: "DDW4NLKPC", 
            text: `Thank you for the answer. We will update our AI with your assistance.`
            })
            .then((req,res) => {
                console.log("Sent confirmation to user");
            })

          });


        } else {

          if (dataExistsInFirebase === false) {
            //add to database
            var data = {
              questionText: messageText,
              messageTS: message.ts,
              questionUser: message.user,
              timeStamp: new Date(),
              channelId: message.channel,
              reminderSent: false
            }

            lastKnownBotQuestion.questionText = messageText;
            lastKnownBotQuestion.messageTS = message.ts;
            lastKnownBotQuestion.questionUser = message.user;
            lastKnownBotQuestion.timeStamp = new Date();
            lastKnownBotQuestion.channelId = message.channel;
            lastKnownBotQuestion.reminderSend = false;
            lastKnownBotQuestion.questionAnswer = "";


            lastKnownBotResponseTS = message.ts;


            
            firebaseController.addFirebaseData(data, function(response) {
              console.log("Data added to firestore:");
              console.log(response);
            });
          }
          
        }



        
      }
      //console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
      
    });

  } else {
    console.log("question in wrong format");
  }

});