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
    },
    getToday: function() {
        const today = new Date();
        today.setTime(today.getTime() + (4 * 60 * 60 * 1000));
        today.setTime(today.getTime() - ((today.getHours() - 1) * 60 * 60 * 1000));
        return today;
    },
    addDays: function(date, days) {
        date.setDate(date.getDate() + days);
        date.setTime(date.getTime() + ((22 - date.getHours()) * 60 * 60 * 1000));
        return date;
    },
    parseDateString: function(date) {
        return String(date.getFullYear()) 
            + "-"
            + String(date.getMonth() + 1).padStart(2, '0')
            + "-"
            + String(date.getDate()).padStart(2, '0');
    },
    getDayOfWeek: function(date) {
        const dayOfWeek = new Date(date).getDay();    
        return isNaN(dayOfWeek) ? null : 
            ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'][dayOfWeek];
    },
    prettifyDate: function(date) {
        return date.split("-").reverse().join(".");
    }
};