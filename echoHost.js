
/* echoHost -- echo back IP/Hostname information of 
 *  application connecting to it
 *
 *
 */


var env = require("./config.js")
var express = require("express");
var fs = require("fs");
var dns = require("dns");
var util = require("util");

var app = express();

app.listen(env.port,function(){
 console.log("[INFO] Starting echoHost server on port: " + env.port);
 console.log("[INFO] Hostname Logging: " + env.logQuery);
});




app.route("/")
 .get(function(req,res){
   if(env.useXForwardedFor){ 
    var remoteAddr = req.headers["x-forwarded-for"]; 
   } 
    else { 
     var remoteAddr = req.connection.remoteAddress; 
    };
   dns.reverse(remoteAddr,function(err,hostnames){
    if (env.useXForwardedFor) {
     var s = { "hostname" : hostnames, "ipaddr" : req.headers["x-forwarded-for"], "agentString" : req.headers["user-agent"] }
    }
     else {
      var s = { "hostname" : hostnames, "ipaddr" : req.connection.remoteAddress, "agentString" : req.headers["user-agent"] }
     }

    /*
     * Note: Gecko-based browsers (like firefox) dont like the text/log header, so send <pre> tag for them
     *
     */
    if (geckoMatch(req.headers["user-agent"])) {
     res.send("<pre>"+"You are");
    }
     else {
      res.writeHead(200, {'Content-Type': 'text/log'});
      res.end(util.inspect(s));
     }
   if (env.logQuery) {
    //write2log(s);
   }
  });
 });






 
app.route("/access.log")
 .get(function(req,res){
  if (env.logVisible){
   res.sendFile(__dirname+"/access.log");
  }
   else {
    res.status(404).send("Cannot GET /access.log");
   }
 });

function write2log(req){
 var s = "At " + (new Date()) + " logged " + req.headers.host + " at " + req.connection.remoteAddress + " User Agent: " + req.headers["user-agent"] + "\n";
 console.log(s);
 fs.appendFile(__dirname+env.logFile,s,function(err){
  if (err) { 
   console.log(err);
  }
 });
};

//figure out a better way to determine gecko
function geckoMatch(userAgent){
 var exp = new RegExp("Firefox");
 return exp.exec(userAgent);
};
