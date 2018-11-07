var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = {

    sendFollowUp: function (webClient, dataObject, callback) {

        webClient.chat.postMessage({ channel: dataObject.questionUser, text: "Was this question of your's answered? \n" + dataObject.questionText, attachments: [{
            "fallback": "You are unable to choose answer.",
            "callback_id": "followup_response",
            "color": "#3AA3E3",
            "actions": [{
                "name": "answer_button",
                "text":"Yes",
                "type":"button",
                "value":"yes"
              },
              {
                "name": "answer_button",
                "text":"No",
                "type":"button",
                "value":"no"
              }]
            }]
          })
        .then((req,res) => {
            console.log("Send button to user");
        })
        .catch(console.error);
    }
}