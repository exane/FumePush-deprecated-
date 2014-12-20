FumePush
========
# Install

## Fast use
### Client
copy both files of /bin/ to your project.
include the following for client:
```html
<script src="bin/FumePushClient.min.js"></script>
```
and then you can use it wherever you want
```javascript
var socket = new FumePush(url, port); // paste here your url and port you want to use
socket.bind(...);
socket.subscribe(...);
...
...
```

### Server
create the following file as server.js (or whatever you want):
```javascript
var FumePush = require('./path/to/FumePushServer.min.js');

var socket = new FumePush(port); // Remember, same port as client!
```
After that you can run server with
```cmd
cd path/to/server
node server.js
```

### Debug-Console
if you want to use the debug-console then copy the folder
debug-console into your project and change the url and port to 
match your client-server config. (i.e.: same url and port as for socket.io)


## dev
```javascript
cmd cd root
npm install
gulp
```


# Syntax

## Server
```javascript
var FumePush = require("FumePushServer.min.js");

var fumePush = new FumePush(4567); //port


fumePush.bind("msg", function(data){
    console.log("event called on server! room: " + data.room + " event: " + data.event + " data: "+data.data);
});

setInterval(function(){
    fumePush.trigger("msg", "message from server!", "channel"); //optional channel
}, 2000);

```

## Client
```javascript
var fumePush = new FumePush("//localhost", 4567); //url, port

var channel = fumePush.subscribe("channel");
var chatChannel = fumePush.subscribe("chat");

chatChannel.bind("msg", function(data){
 // ...
});

channel.bind("test", function(data){
 // ...
});

fumePush.bind("msg", function(data){
 // ...
});

fumePush.unsubscribe("channel");

fumePush.trigger("msg", "send to all clients bound by event 'msg'");

chatChannel.trigger("msg", "send to all clients bound by event 'msg' and subscribed to 'chat'");

chatChannel.broadcast("msg", "same as .trigger but clients which fired these events wont receive it back");


```


