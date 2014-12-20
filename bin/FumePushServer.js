/**
 * @module Server
 */

var Socket = (function(){

    /**
     * Constructor
     * @class Socket
     * @param {number} port
     * @constructor
     */
    var Socket = function(port){
        this.port = port;
        this._listen();
    };
    var r = Socket.prototype;

    /**
     * @property {Number} port
     * @private
     */
    r.port = null;

    /**
     * @property {Object} io
     * @private
     */
    r.io = null;

    /**
     *
     * @property {Array} rooms
     * @private
     */
    r._rooms = [];

    /**
     *
     * @type {Array} events
     * @private
     */
    r._events = [];

    /**
     *
     * @type {Array} bindings
     * @private
     */
    r._bindings = [];

    /**
     * @method _listen
     * @private
     *
     */
    r._listen = function(){
        this.io = require("socket.io").listen(this.port, {log: false});
        this._onConnection();
    };

    /**
     * @method _onConnection
     * @private
     */
    r._onConnection = function(){
        var that = this;
        this.io.on("connection", function(socket){
            that._onDisconnect(socket);
            that._onTriggerEvent(socket);
            that._onJoinEvent(socket);
            that._onLeaveEvent(socket);
            that._onUnbindEvent(socket);
        })
    };

    /**
     * @method _onDisconnect
     * @private
     * @param {Object} socket
     */
    r._onDisconnect = function(socket){
        socket.on("disconnect", function(){
            //console.log("user disconnected");

        })
    };

    r._onUnbindEvent = function(socket){
        var that = this;
        socket.on("FumePush:unbind", function(event){
            that.io.removeListener(event, function(){});
            socket.removeListener(event, function(){});
        });
    }

    /**
     * @method _onTriggerEvent
     * @private
     * @param {Object} socket
     */
    r._onTriggerEvent = function(socket){
        var that = this;
        socket.on("Trigger:Event", function(data){
            if(data.isBroadcasting)
                that.broadcast(socket, data);
            else if(data.toAll)
                that._trigger(socket, data, true);
            else
                that._trigger(socket, data);
        })
    };

    /**
     * @method _onJoinEvent
     * @private
     * @param {Object} socket
     */
    r._onJoinEvent = function(socket){
        var that = this;
        socket.on("Join:Room", function(channel){
            //console.log("joined room");
            socket.join(channel);
            for(var i = 0; i < that._rooms.length; i++)
                if(that._rooms[i] == channel) return 0;
            that._rooms.push(channel);
        })
    };

    /**
     * @method _onLeaveEvent
     * @private
     * @param {Object} socket
     */
    r._onLeaveEvent = function(socket){
        var that = this;
        socket.on("Leave:Room", function(channel){
            //console.log("leaved room", channel);
            socket.leave(channel);
            for(var i = 0; i < that._rooms.length; i++) {
                if(that._rooms[i] != channel) continue;
                return that._rooms.splice(i, 1);
            }
        })
    };

    /**
     * @method _addEvent
     * @private
     * @param {string} event
     */
    r._addEvent = function(event){
        this._events.push(event);
    };

    /**
     * @method _removeEvent
     * @param {string} event
     * @private
     */
    r._removeEvent = function(event){
        for(var i = 0; i < this._events.length; i++) {
            if(this._events[i] != event) continue;
            this._events.splice(i, 1);
            return this._removeEvent(event); //just in case
        }
    };

    /**
     * @method _hasEvent
     * @param {string} event
     * @private
     * @returns {boolean}
     */
    r._hasEvent = function(event){
        for(var i = 0; i < this._events.length; i++)
            if(this._events[i] == event) return true;
        return false;
    };

    /**
     * @method _trigger
     * @param {Object} socket
     * @param {Object} data
     * @param {boolean} [toAll=false]
     * @private
     */
    r._trigger = function(socket, data, toAll){
        toAll = toAll || false;
        ////console.log("sending to " + data.room + " with event " + data.event);
        this._callBindings(socket, data);
        if(toAll)
            this.io.sockets.emit(data.event, data);
        else
            this.io.sockets.to(data.room).emit(data.event, data);
    };

    /**
     * @method broadcast
     * @param {object} socket
     * @param {object} data
     * @public
     */
    r.broadcast = function(socket, data){
        socket.broadcast.emit(data.event, data);
    };

    /**
     * @method bind
     * @param {string} event
     * @param {function} cb
     * @public
     */
    r.bind = function(event, cb){
        if(event === "connection"){
            event = "FumePush:connection";
        }
        this._bindings.push({event: event, cb: cb});
    };

    /**
     * @method _callBindings
     * @param {object} socket
     * @param {object} data
     * @private
     */
    r._callBindings = function(socket, data){
        for(var i = 0; i < this._bindings.length; i++) {
            if(this._bindings[i].event !== data.event) continue;
            this._bindings[i].cb.call(this, data);
        }
    };

    /**
     * @method trigger
     * @param {string} event
     * @param {object} data
     * @param {string} [room]
     */
    r.trigger = function(event, data, room){
        room = room || "FumePush:PUBLIC";
        data = {
            event: event,
            data: data,
            room: room
        };

        if(room !== "FumePush:PUBLIC")
            this.io.sockets.to(room).emit(event, data);
        else
            this.io.sockets.emit(event, data);
    }

    return Socket;
})();

module.exports = Socket;