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

/*
web.channels.list().then((res) => {
    // Take any channel for which the bot is a member
    const channel = res.channels.find(c => c.is_member);

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Hello @channel! This is USAA SmartBot here to help with any questions you may have.', channel.id)
        // Returns a promise that resolves when the message is sent
        .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts} with channel id:${channel.id}`))
        .catch(console.error);
    } else {
      console.log('This bot has not been added to any channels yet');
    }
  });
*/

rtm.on('message', (message) => {
  // Theres more event handling api stuff at:  https://api.slack.com/events/message
  // This will constantly check for messages in any channel that the bot is part of
  // we can parse this messages and send the data to dialogflow to get a reponse back.

  if (message === undefined || message.text === undefined || message.text.length === 0){ return; }
  // Skip messages that are from a bot or my own user ID
  if ((message.subtype && message.subtype === 'bot_message') || (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  console.log(message);

  //console.log(message.text);
  if (message.message !== undefined) {
    console.log(message.message);  
  }
  
  //console.log("replies");
  //console.log(message.replies);
  //console.log(message.replies[message.reply_count-1]);

  var messageText = message.text;
  messageText = messageText.toLowerCase();


  //if ( message.text !== undefined && (message.text.includes("what") || message.text.includes("how") || message.text.includes("why") || message.text.includes("where") ||
  //  message.text.includes("hi") || message.text.includes("hello") || message.text.includes("?") || message.text.includes("food")) ) {
  if ( messageText.includes("what") || messageText.includes("how") || messageText.includes("why") || messageText.includes("where") ||
       messageText.includes("hi") || messageText.includes("hello") || messageText.includes("?") || messageText.includes("food") ) {

    dialogFlowController.getMessageResponse(message.text, function(responseText) {
      //console.log(responseText);
      //console.log(responseText.replies);
      //console.log(message.channel);

      
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
  }
    
  //} else {
   // console.log("Unknown question format found");
  //}

  
  

});
