var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = {

    sendFollowUp: function (webClient, dataObject, callback) {

        var newMessageTS = dataObject.messageTS.replace('.', '');
        console.log(newMessageTS);

        webClient.chat.postMessage({ channel: dataObject.questionUser, 
        text: `<@${dataObject.questionUser}> Has your question been answered?`,
        attachments: [{
            text:`'${dataObject.questionText}'\n\nhttps://phoenixfyre.slack.com/archives/${dataObject.channelId}/p${newMessageTS}`
        }] 
        })
        .then((req,res) => {
            console.log("Send button to user");
        })
        .catch(console.error);
    }
}