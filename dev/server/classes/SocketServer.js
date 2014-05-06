var Socket = (function () {

    var Socket = function (port) {
        this.port = port;
        this.listen();
    };
    var r = Socket.prototype;

    r.port = null;
    r.io = null;
    r._rooms = [];
    r._events = [];

    r.listen = function () {
        this.io = require("socket.io").listen(this.port, {log: false});
        this.onConnection();
    };


    r.onConnection = function () {
        var that = this;
        this.io.on("connection", function (socket) {
            console.log("new user connected");
            that.onDisconnect(socket);
            that.onTriggerEvent(socket);
            that.onJoinEvent(socket);
            that.onLeaveEvent(socket);
        })
    };

    r.onDisconnect = function (socket) {
        socket.on("disconnect", function () {
            console.log("user disconnected");

        })
    };

    r.onTriggerEvent = function (socket) {
        var that = this;
        socket.on("Trigger:Event", function (data) {
            if (data.isBroadcasting)
                that.broadcast(socket, data);
            else if (data.toAll)
                that.trigger(socket, data, true);
            else
                that.trigger(socket, data);
        })
    };

    r.onJoinEvent = function (socket) {
        var that = this;
        socket.on("Join:Room", function (channel) {
            console.log("joined room");
            socket.join(channel);
            for (var i = 0; i < that._rooms.length; i++)
                if (that._rooms[i] == channel) return 0;
            that._rooms.push(channel);
        })
    };
    r.onLeaveEvent = function (socket) {
        var that = this;
        socket.on("Leave:Room", function (channel) {
            console.log("leaved room", channel);
            socket.leave(channel);
            for (var i = 0; i < that._rooms.length; i++) {
                if (that._rooms[i] != channel) continue;
                return that._rooms.splice(i, 1);
            }
        })
    };
    r.addEvent = function (event) {
        this._events.push(event);
    };
    r.removeEvent = function (event) {
        for (var i = 0; i < this._events.length; i++) {
            if (this._events[i] != event) continue;
            this._events.splice(i, 1);
            return this.removeEvent(event); //just in case
        }
    };
    r.hasEvent = function (event) {
        for (var i = 0; i < this._events.length; i++)
            if (this._events[i] == event) return true;
        return false;
    };
    r.trigger = function (socket, data, toAll) {
        toAll = toAll || false;
        //console.log("sending to " + data.room + " with event " + data.event);
        if (toAll)
            this.io.sockets.emit(data.event, data);
        else
            this.io.sockets.to(data.room).emit(data.event, data);
    };
    r.broadcast = function (socket, data) {
        socket.broadcast.emit(data.event, data);
    };


    //r.listen();
    return Socket;
})();

module.exports = Socket;