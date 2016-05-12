echoHost -- simple node server to echo back hostname info

0.0.1 -- Impelmented basic logging feature at /access.log. To turn off/make invisible change logQuery or logVisible in config.js

NOTE: It is reccomended that you use nginx as your proxy server, when you do this make sure to add the X-Forwarded-For HTTP header in
       your server block, otherwise all you will get back is localhost@127.0.0.1
