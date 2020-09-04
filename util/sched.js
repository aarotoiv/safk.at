const misc = require('./misc');

module.exports = {
    formatSchedule: function(sched, from) {
        let ret = {};
        sched.forEach((schedItem) => {
            const startDate = schedItem.start_date;
            const endDate = schedItem.end_date;
            const dateString = startDate.split(" ")[0];
            if (!ret[dateString]) {
                ret[dateString] = {};
                ret[dateString].todayDate = from;
                ret[dateString].longest = 27;
                ret[dateString].weekDay = misc.getDayOfWeek(dateString);
                ret[dateString].day = misc.prettifyDate(dateString);
                ret[dateString].events = [];
            }
            
            let eventInfo = {
                startTime: startDate.split(" ")[1],
                endTime: endDate.split(" ")[1],
                time: startDate.split(" ")[1],
                info: []
            };

            if (schedItem.code) {
                schedItem.code.forEach(code => {
                    eventInfo.info.push(code);
                });
            }

            if (schedItem.subject) 
                eventInfo.info.push(schedItem.subject);
            
            if (schedItem.location) {
                schedItem.location.forEach(loc => {
                    eventInfo.info.push(loc.class);
                });
            }
            
            if (schedItem.reserved_for) {
                schedItem.reserved_for.forEach(reserved => {
                    eventInfo.info.push(reserved);
                });
            }

            ret[dateString].events.push(eventInfo);
            
        });

        return Object.values(ret);
    },
    cleanSchedule: function(days) {
        let cleaned = [];
        let mostRows = 0;
        days.forEach(function(day) {
            let titleDivider = "";
            let dayDivider = "";
            for(let i = 0; i< day.longest; i++) {
                titleDivider += "━";
                dayDivider += "─";
            }

            let dayContent = "";
            let rows = 0;
            dayContent += day.day;
            dayContent += "\n"
            dayContent += titleDivider;
            dayContent += "\n";
            rows += 2;
            day.events.forEach(function(event) {
                dayContent += event.time;
                dayContent += "\n";
                rows++;
                event.info.forEach(function(infoLine) {
                    dayContent += infoLine;
                    dayContent += "\n";
                    rows++;
                });
                dayContent += `${dayDivider}\n`;
                rows++;
            });
            if(rows > mostRows)
                mostRows = rows;
            cleaned.push({day: dayContent.split("\n"), longest: day.longest});
        });
        let render = "";
        for(let i = 0; i<mostRows; i++) {
            for(let j = 0; j<cleaned.length; j++) {
                const longest = cleaned[j].longest;
                const line = cleaned[j].day[i];
                const lineLength = line ? line.length : 0;
                
                let spacing = "";
                for(let k = 0; k<longest - lineLength; k++) {
                    spacing += " ";
                }
                render += `│${(line ? line : "") + spacing} `;                
            }
            render += "\n";
        }
        return render;
    },
    limitInfoLength: function(days, lengthLimit) {
        days.forEach(day => {
            day.events.forEach(event => {
                event.info.forEach((info, i) => {
                    if (info.length > lengthLimit) 
                        event.info[i] = info.substring(0, 25) + "..";
                });
            });
        });
        return days;
    }
};
