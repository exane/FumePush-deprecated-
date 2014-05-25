/**
 * @module Client
 */
var FumePush = (function(){

    var Channel = require("./FumePush.Channel");

    /**
     * Constructor
     * @param {string} url
     * @param {number} port
     * @class FumePush
     * @constructor
     */
    var FumePush = function(url, port){
        this._connect.call(this, url, port);

    };


    var r = FumePush.prototype;

    /**
     * socket.io instance object.
     * @property _socket
     * @type {object}
     * @private
     */
    r._socket = null;



    /**
     * List of all joined channels.
     * @property _rooms
     * @private
     * @type {Array}
     */
    r._rooms = [];





    /**
     * Creates new instance of socket.io and saves into socket property.
     * @param url
     * @param port
     * @method _connect
     * @private
     */
    r._connect = function(url, port){
        this._socket = io.connect(url + ":" + port);
    };





    /**
     * Send an event to all channels.
     * @param {string} event
     * @param {object} data
     * @method trigger
     * @public
     */
    r.trigger = function(event, data){
        var isBroadcasting = isBroadcasting || false;
        //console.log("FumePush" + ".trigger('%s', '%s')", event, data);
        this._socket.emit("Trigger:Event", {
            room: "FumePush:PUBLIC",
            event: event,
            data: data,
            isBroadcasting: isBroadcasting,
            toAll: true
        });
    };




    /**
     * Creates a listener event which fires the callback whenever any channel calls.
     * @method bind
     * @param {string} event
     * @param {function} callback
     * @public
     */
    r.bind = function(event, callback){
        var that = this;
        this._socket.on(event, function(data){
            //if(data.room != "FumePush:PUBLIC" && that.channelName != data.room) return 0;
            //console.log("FumePush" + ".on('%s', '%s')", event, data.data);
            callback.call(that, data.data)
        })
    };


    /**
     * Removes event listeners in all channels of this socket
     * @method unbind
     * @param {string} event
     * @public
     */
    r.unbind = function(event){
        this._socket.removeAllListeners(event);
    }


    /**
     * Creates EventListener which fires callback once
     * @method bindOnce
     * @param {string} event
     * @param {function} callback
     * @public
     */
    r.bindOnce = function(event, callback){
        var that = this;
        this._socket.once(event, function(data){
            callback.call(that, data.data)
        })
    }




    /**
     * Create and returns a new instance of Channel.
     * @param {string} channelName
     * @method subscribe
     * @public
     * @return {Channel} new Channel Instance
     */
    r.subscribe = function(channelName){
        var channel = new Channel(this._socket, channelName);
        this._rooms.push(channelName);
        return channel;
    };


    /**
     * Leaves the channel.
     * @param {string} channelName
     * @method unsubscribe
     * @public
     */
    r.unsubscribe = function(channelName){
        this._rooms.splice(channelName);
        this._socket.emit("Leave:Room", channelName);
        for(var i = 0; i < this._rooms.length; i++) {
            if(this._rooms[i] == channelName)
                return this._rooms.splice(i, 1);
        }


    };


    /**
     * Not implemented yet.
     * @method disconnect
     * @public
     */
    r.disconnect = function(){
        //console.log("not implemented yet");
    };

    return FumePush;
})();

module.exports = FumePush;