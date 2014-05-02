define([], function(){
    var Channel = function(socket, ChannelName){
        this.channelName = ChannelName;
        this.socket = socket;
        this._joinRoom(this.channelName);
    };
    var r = Channel.prototype;
    r.channelName = null;
    r.socket = null;


    r._joinRoom = function(roomName){
        this.socket.emit("Join:Room", roomName)
    };

    r.trigger = function(event, data, isBroadcasting){
        var that = this;
        isBroadcasting = isBroadcasting || false;
        this.socket.emit("Trigger:Event", {
            room: that.channelName,
            event: event,
            data: data,
            isBroadcasting: isBroadcasting
        });

    };

    r.bind = function(event, callback){
        var that = this;
        this.socket.on(event, function(data){
            if(data.room != "FumePush:PUBLIC" && that.channelName != data.room) return 0;
            console.log(that.channelName + ".on('%s', '%s')", event, data.data);
            callback.call(that, data.data)
        })
    };

    r.broadcast = function(event, data){
        this.trigger(event, data, true);
    };


    return Channel;
});