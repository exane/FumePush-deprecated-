
global.FumePush = require("../../bin/FumePushServer.min.js");

var fumePush = new FumePush(4567);

fumePush.bind("blubb test", function(data){
    //console.log("event called on server! room: " + data.room + " event: " + data.event + " data: "+data.data);
});

setInterval(function(){
    //fumePush.trigger("eventFromServer", "yoloEventServer", "yolo");
},2000);

