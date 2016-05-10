
/* echoHost -- echo back IP/Hostname information of 
 *  application connecting to it
 *
 *
 */


var env = require("./config.js")

var express = require("express");
var fs = require("fs");

var app = express();

app.listen(env.port,function(){
 console.log("[INFO] Starting echoHost server on port: " + env.port);
 console.log("[INFO] Hostname Logging: " + env.logQuery);
});

app.route("/")
 .get(function(req,res){
   var s = ("You are " + req.headers.host + " at " + req.connection.remoteAddress + "\n" + "User Agent: " + req.headers["user-agent"]);
   
   /*
    * Note: Gecko-based browsers (like firefox) dont like the text/log header, so send <pre> tag for them
    *
    */
   if (geckoMatch(req.headers["user-agent"])) {
    res.send("<pre>" + s);
   }
    else {
     res.writeHead(200, {'Content-Type': 'text/log'});
     res.end(s);
     //write2log(util.inspect(req));
    }
  if (env.logQuery) {
   write2log(req);
  }
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
