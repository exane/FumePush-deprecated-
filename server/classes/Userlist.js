var Userlist = (function(){
    var Userlist = function(){
        this.users = [];
    };
    var r = Userlist.prototype;

    r.add = function(user){
        this.users.push(user);
    };

    r.remove = function(user){
        var n = this.users.length;
        for(var i=0; i<n; i++){
            if(this.users[i].id !== user.id) continue;
            this.users.splice(i, 1);
            return this.remove(user); // just in case
        }
    };

    r.getUserById = function(id){
        var n = this.users.length;
        for(var i=0; i<n; i++){
            if(this.users[i].id !== id) continue;
            return this.users[i];
        }
    };

    return Userlist;
})();

module.exports = new Userlist();