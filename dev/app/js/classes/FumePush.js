/**
 * @module FumePush
 */
var FumePush = (function(){

    var Channel = require("./FumePush.Channel");

    /**
     *
     * @param {string} url
     * @param {number} port
     * @class FumePush
     * @constructor
     */
    var FumePush = function(url, port){
        if(!url) throw new Error("Missing url");
        if(!port) throw new Error("Missing port");
        this._connect.call(this, url, port);

    };


    var r = FumePush.prototype;

    /**
     * socket.io instance object.
     * @property socket
     * @type {object}
     * @private
     */
    r._socket = null;



    /**
     * List of all joined channels.
     * @property rooms
     * @private
     * @type {Array}
     */
    r._rooms = [];





    /**
     * Creates new instance of socket.io and saves into socket property.
     * @param url
     * @param port
     * @method connect
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
        //console.log("FumePush" + ".trigger('%s', '%s')", event, data);
        if(typeof data === "function") throw new Error("no functions allowed");

        if(this.isJson(data)){
            data = JSON.parse(data);
        }

        this._socket.emit("Trigger:Event", {
            room: "FumePush:PUBLIC",
            event: event,
            data: data,
            isBroadcasting: false,
            toAll: true
        });
    };

    r.isJson = function(str){
        try {
            JSON.parse(str);
        } catch(e) {
            return false;
        }
        return true;
    }




    /**
     * Creates a listener event which will fire the callback whenever any channel calls.
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
     * Create and returns a new instance of Channel.
     * @param {string} channelName
     * @method subscribe
     * @public
     * @returns {Channel}
     */
    r.subscribe = function(channelName){
        var channel = new Channel(this._socket, channelName, this);
        this._rooms.push(channelName);
        return channel;
    };


    /**
     * Leaves the channel.
     * @param {string} channelName
     * @method unsubscribe
     * @pubic
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