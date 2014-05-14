var FumePush = (function(){

    var Channel = require("./FumePush.Channel");

    var FumePush = function(url, port){
        _connect.call(this, url, port);

    };
    var r = FumePush.prototype;
    r.socket = null;
    r._rooms = [];

    var _connect = function(url, port){
        this.socket = io.connect(url + ":" + port);
    };

    r.trigger = function(event, data){
        var isBroadcasting = isBroadcasting || false;
        //console.log("FumePush" + ".trigger('%s', '%s')", event, data);
        this.socket.emit("Trigger:Event", {
            room: "FumePush:PUBLIC",
            event: event,
            data: data,
            isBroadcasting: isBroadcasting,
            toAll: true
        });
    };


    r.bind = function(event, callback){
        var that = this;
        this.socket.on(event, function(data){
            //if(data.room != "FumePush:PUBLIC" && that.channelName != data.room) return 0;
            //console.log("FumePush" + ".on('%s', '%s')", event, data.data);
            callback.call(that, data.data)
        })
    };


    r.subscribe = function(channelName){
        var channel = new Channel(this.socket, channelName);
        this._rooms.push(channelName);
        return channel;
    };

    r.unsubscribe = function(channelName){
        //console.log("~~unsubscribe: " + channelName);
        this._rooms.splice(channelName);
        this.socket.emit("Leave:Room", channelName);
        for(var i = 0; i < this._rooms.length; i++) {
            if(this._rooms[i] == channelName)
                return this._rooms.splice(i, 1);
        }


    };

    r.disconnect = function(){
        //console.log("not implemented yet");
    };

    return FumePush;
})();

module.exports = FumePush;