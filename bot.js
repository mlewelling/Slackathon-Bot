const { RTMClient, WebClient } = require('@slack/client');
const auth = require('./auth/authTokens.js');
const dialogFlowController = require('./controllers/DialogFlowController.js')

// OAuth token to be able to access the app
const token = auth.oauthToken;

//Start a RealTimeMessager Client session with the oauth token
const rtm = new RTMClient(token);
rtm.start();

// This uses the WebClient to search through any channels that the bot may be a part of
// This is mostly to announce the bot to each channel
const webClient = new WebClient(token);

rtm.on('message', (message) => {

  if (message === undefined || message.text === undefined || message.text.length === 0){ 
    return; 
  }
  //Don't allow the bot to read it's own messages
  if ((message.subtype && message.subtype === 'bot_message') || (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  var messageText = message.text;
  messageText = messageText.toLowerCase();

  if ( messageText.includes("what") || messageText.includes("how") || messageText.includes("why") || messageText.includes("where") ||
       messageText.includes("hi") || messageText.includes("hello") || messageText.includes("?") || messageText.includes("food") ) {

    dialogFlowController.getMessageResponse(message.text, function(responseText) {
      
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
      //console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);

    });
  } else {
    console.log("Unknown question");
    //add to database here

    
  }

});
