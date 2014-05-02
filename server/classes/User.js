global.Userlist = global.Userlist || require("./Userlist.js");

var User = (function(){
    var User = function(socket, name){
        this.name = name || this.generateGuestName();
        this.id = socket.id || null;
        this.socket = socket || null;

        this.addToUserlist();
    };
    var r = User.prototype;

    r.addToUserlist = function(){
        Userlist.add(this);
    };

    r.removeFromUserlist = function(){
        Userlist.remove(this);
    };

    r.generateGuestName = function(){
        return "Guest" + ~~(Math.random()*10000);
    };

    r.hasEvent = function(event){
        var events = this.socket._events;
        for(var e in events)
            if(e === event) return true;
        return false;
    };

    return User;
})();

module.exports = User;