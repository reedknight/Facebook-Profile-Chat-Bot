console.log("Execution Started")
console.log("-----------------")

var login = require('facebook-chat-api');
var fs = require('fs');
var cleverbot = require("cleverbot.io")

/*## BASIC SETUP ##*/

var FB_PASSWORD = "--FB PASSWORD--";
var FB_EMAIL = "-- FB EMAIL --";

 // Set Clever Bot keys
var bot = new cleverbot("--API USER--", "--API KEY--");

/*## NO EDITTING AFTER HERE ##*/

var callback = function(err, api) {
    if(err) return console.error(err);

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

    api.listen(function callback(err, message) {
        console.log("Message : " + message.body);
        bot.ask(message.body, function (err, response) {
            console.log("Response : " + response);
            api.sendMessage(response, message.threadID);
        });
    });
};

bot.setNick("R2D2"); // Set a nickname

bot.create(function (err, session) {

    fs.stat('appstate.json', function(err, stat) {
        if(err == null) {
            console.log('App State exists');
            login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, callback);
        } else if(err.code == 'ENOENT') {
            // file does not exist
            console.log("App State does not exist");
            login({email: FB_EMAIL, password: FB_PASSWORD}, callback);
        } else {
            console.log('Some other error: ', err.code);
        }
    });
});
