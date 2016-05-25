# echoHost
A simple nodejs server to echo back hostname information

**NOTE** If using nginx as a proxy server make sure you add the X-Forwarded-For HTTP header in the server block. Otherwise you will get localhost at 127.0.0.1

### Installation
```console
$ npm install
$ node echoHost.js
```

### Usage
Use your favorite browser or curl the host its running on


**0.0.1** -- Impelmented basic logging feature at /access.log. To turn off/make invisible change logQuery or logVisible in config.js

