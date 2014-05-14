
var main = (function(){

    var fumePush = new FumePush("//localhost", 4567);

    var yolo = fumePush.subscribe("yolo");
    var swag = fumePush.subscribe("swag");

    yolo.bind("Send:msg", function(data){
        console.log("yolo - subscribed to: " + this.channelName + " with msg: " + data);
    });

    swag.bind("Mega:Swag", function(data){
        console.log("swag - subscribed to: " + this.channelName + " with msg: " + data);

    });

    swag.bind("Send:msg", function(data){
        console.log(data);
    });

    fumePush.bind("Send:msg", function(data){
        console.log(data, "yooo");

    });

    //swag.trigger("blubb test", "yoooollooooo");

    fumePush.trigger("Mega:Swag", "yoo bitches!");

    //fumePush.unsubscribe("yolo");

    fumePush.trigger("Send:msg", "swag power");

    //swag.broadcast("sendToAll:msg", "yolo swag united!");

    yolo.bind("eventFromServer", function(data){
        console.log(data);
    })


    setInterval(function(){
        //swag.trigger("Send:msg", "yolo msg");
    }, 1000);

    setTimeout(function(){
        //swag.trigger("Mega:Swag", "swag msg");
    }, 1000);
})();