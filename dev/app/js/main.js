
var main = (function(){

    var fumePush = new FumePush("//localhost", 4567);


    var yolo = fumePush.subscribe("yolo");
    var swag = fumePush.subscribe("swag");
    var testUnbind = fumePush.subscribe("test1");

    yolo.bind("Send:msg", function(data){
        console.log("yolo - subscribed to: " + this.getChannelName() + " with msg: ", data);
    });

    swag.bind("Mega:Swag", function(data){
        console.log("swag - subscribed to: " + this.getChannelName() + " with msg: ", data);

    });

    swag.bind("Send:msg", function(data){
        console.log(data);
    });

    fumePush.bind("Send:msg", function(data){
        console.log(data, "yooo");
    });

    swag.trigger("blubb test", "yoooollooooo");

    fumePush.trigger("Mega:Swag", "yoo bitches!");

    //fumePush.unsubscribe("yolo");
    var json = '{"user": "pyxl","message": "yeah yeah","time": "11:12"}';

    fumePush.trigger("Send:msg", "swag power");
    fumePush.trigger("Send:msg", {
        user: "exane",
        message: "yoyo",
        time: "12:12"
    });
    fumePush.trigger("Send:msg", {
        user: "exane",
        message: "yoyo",
        time: "12:12"
    });
    fumePush.trigger("Send:msg", json);

    swag.broadcast("sendToAll:msg", "yolo swag united!");

    yolo.bind("eventFromServer", function(data){
        console.log(data);
    })



    testUnbind.bind("eventToUnbind", function(){
        console.log("channel event unbinding!");
    })

    swag.bind("eventToUnbind", function(){
        console.log("no unbinding!");
    })

    //fumePush.unbind("eventToUnbind");
    testUnbind.unbind("eventToUnbind");
    //swag.unbind("eventToUnbind");

    testUnbind.trigger("eventToUnbind", "yolo");
    swag.trigger("eventToUnbind", "yolo");




    fumePush.bind("yoyoEvent", function(){
        console.log("unbind me!!!");
    })

    fumePush.unbind("yoyoEvent");


    fumePush.trigger("yoyoEvent");



    fumePush.bindOnce("onceEvent!", function(data){
        console.log("yolo called only once!!" + data);
    })

    fumePush.trigger("onceEvent!", "get fire!");
    fumePush.trigger("onceEvent!", "dont fire!");



    setInterval(function(){
        //swag.trigger("Send:msg", "yolo msg");
    }, 1000);

    setTimeout(function(){
        //swag.trigger("Mega:Swag", "swag msg");
    }, 1000);
})();