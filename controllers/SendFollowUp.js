var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = {

    sendFollowUp: function (webClient, dataObject, callback) {

        webClient.chat.postMessage({ channel: "CDXHFFX3Q", text: "Was your question answered?", attachments: [{
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
            console.log("in .then");
            app.post('/slack/actions', urlencodedParser, (req, res) =>{
                console.log("in post ", req, res);
                res.status(200).end() // best practice to respond with 200 status
                var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
                var message = {
                    "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
                    "replace_original": false
                }
                sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
            })
                  console.log('Follow up message sent! ', res);
        })
        .catch(console.error);
    }
}