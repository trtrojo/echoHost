
/* echoHost -- echo back IP/Hostname information of 
 *  application connecting to it
 *
 *
 */


var env = require("./config.js")
var express = require("express");
var fs = require("fs");
var dns = require("dns");
var port = process.env.PORT || env.port;

var app = express();

app.listen(env.port,function(){
 console.log("[INFO] Starting echoHost server on port: " + env.port);
 console.log("[INFO] Hostname Logging: " + env.logQuery);
});

app.route("/")
 .get(function(req,res){
  var s = { "hostname":"","ipaddr":"","agentstring":"" };

  if(env.useXForwardedFor){ 
   var remoteAddr = req.headers["x-forwarded-for"]; 
  } 
   else { 
    var remoteAddr = req.connection.remoteAddress; 
   };

  dns.reverse(remoteAddr,function(dnserr,hostnames){
   if (dnserr || hostnames[0] == null) { s.hostname = "Hostname not found" }
    else { s.hostname = hostnames[0]; };
   if (env.useXForwardedFor) {
    s = { "hostname":s.hostname, "ipaddr" : req.headers["x-forwarded-for"], "agentstring" : req.headers["user-agent"] }
   }
    else {
     s = { "hostname":s.hostname, "ipaddr" : req.connection.remoteAddress, "agentstring" : req.headers["user-agent"] }
    }
   
    /*
     * Note: Gecko-based browsers (like firefox) dont like the text/log header, so send <pre> tag for them
     *
     */
    if (geckoMatch(req.headers["user-agent"])) {
     res.send("<pre>"+"You are "+s.hostname+" at "+s.ipaddr+"\nUser Agent:"+s.agentstring);
    }
     else {
      res.writeHead(200, {'Content-Type': 'text/log'});
      res.end("You are "+s.hostname+" at "+s.ipaddr+"\nUser Agent:"+s.agentstring+"\n");
     }
   if (env.logQuery) {
    write2log(s);
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

function write2log(input){
 var t = "At " + (new Date()) + " logged " + input.hostname + " at " + input.ipaddr + " User Agent: " + input.agentstring + "\n";
 console.log(t);
 fs.appendFile(__dirname+"/access.log",t,function(err){
  if (err) { 
   console.log(err);
  };
 });
};

//figure out a better way to determine gecko
function geckoMatch(userAgent){
 var exp = new RegExp("Firefox");
 return exp.exec(userAgent);
};
