const { RTMClient, WebClient } = require('@slack/client');

// OAuth token to be able to access the app
const token = 'xoxb-471927783220-471421163680-lcKUfqGYO5tnKe8EOOpEwTfy';

//Start a RealTimeMessager Client session with the oauth token
const rtm = new RTMClient(token);
rtm.start();

//Found this from running the previous command
const channelID = 'CDXHFFX3Q';

/*
// The RTM client can send simple string messages
*/

//This uses the WebClient to search through any channels that the bot may be a part of
// not really sure if this is the best way to do this but I can find the channel ID like this
const web = new WebClient(token);
web.channels.list()
  .then((res) => {
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

rtm.on('message', (message) => {
  // Theres more event handling api stuff at:  https://api.slack.com/events/message
  // This will constantly check for messages in any channel that the bot is part of
  // we can parse this messages and send the data to dialogflow to get a reponse back.

  rtm.sendMessage(`New message found: ${message.text}`, channelID)
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);

  // Skip messages that are from a bot or my own user ID
  if ( (message.subtype && message.subtype === 'bot_message') || (!message.subtype && message.user === rtm.activeUserId) ) {
    return;
  }

});
  