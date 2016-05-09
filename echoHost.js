
/* echoHost -- echo back IP/Hostname information of 
 *  application connecting to it
 *
 *
 */

var env = require("./config.js")

var express = require("express");
var browser = require("bowser");

console.log(env);

var app = express();

app.listen(env.port,function(){
 console.log("[INFO] Starting echoHost server on port: " + env.port);
 console.log("[INFO] Hostname Logging: " + env.logquery);
});

app.route("/")
 .get(function(req,res){
   res.send(req.headers['user-agent']);
   console.log(req);
 });
