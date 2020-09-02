module.exports = {
    showWebsite: function(type) {
        if(type == "phone" || type == "desktop") 
            return true;
        return false;
    },
    delay: function(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time);
        });
    }
};