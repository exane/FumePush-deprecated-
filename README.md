FumePush
========
# Syntax

## Server
```javascript
var FumePush = require("FumePushServer.min.js");

var fumePush = new FumePush(4567); //port


fumePush.bind("msg", function(data){
    console.log("event called on server! room: " + data.room + " event: " + data.event + " data: "+data.data);
});

setInterval(function(){
    fumePush.trigger("msg", "message from server!", "channel");
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


