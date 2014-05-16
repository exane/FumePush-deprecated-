/**
 * @module Channel
 */
var Channel = (function(){

    /**
     * @class Channel
     * @param {object} socket
     * @param {string} ChannelName
     * @constructor
     */
    var Channel = function(socket, ChannelName){
        this._channelName = ChannelName;
        this.socket = socket;
        this._joinRoom(this._channelName);
    };
    var r = Channel.prototype;


    /**
     * Name of instance.
     * @property {string} Channelname
     * @private
     */
    r._channelName = null;


    /**
     * Socket.io instance reference.
     * @property {object} socket
     * @private
     */
    r._socket = null;


    /**
     * Sends an event "Join:Room" with roomName to server which joins this instance to a room.
     * @param {string} roomName
     * @method joinRoom
     * @private
     */
    r._joinRoom = function(roomName){
        this._socket.emit("Join:Room", roomName)
    };


    /**
     * Send an event to server with data. Server will redirect to everybody (includes sender)
     * within same channel and listening to same event.
     * @param {string} event
     * @param {object} data
     * @method trigger
     */
    r.trigger = function(event, data, isBroadcasting){
        var that = this;
        isBroadcasting = isBroadcasting || false;
        this._socket.emit("Trigger:Event", {
            room: that._channelName,
            event: event,
            data: data,
            isBroadcasting: isBroadcasting
        });

    };


    /**
     * Starts listening to an event of same channel.
     * @method bind
     * @param {string} event
     * @param {function} callback
     * @public
     */
    r.bind = function(event, callback){
        var that = this;
        this._socket.on(event, function(data){
            if(data.room != "FumePush:PUBLIC" && that._channelName != data.room) return 0;
            //console.log(that._channelName + ".on('%s', '%s')", event, data.data);
            callback.call(that, data.data)
        })
    };


    /**
     * Send an event to server with data. Server will redirect to everybody, except sender, within same channel and listening to same event.
     * @param {string} event
     * @param {object} data
     * @public
     * @method broadcast
     */
    r.broadcast = function(event, data){
        this.trigger(event, data, true);
    };


    return Channel;
})();

module.exports = Channel;