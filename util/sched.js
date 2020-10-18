const axios = require('axios');
const misc = require('./misc');
const keys = require('../keys');

const httpClient = axios.create();
httpClient.defaults.timeout = 2000;

module.exports = {
    fetchSchedule: async function(classId) {
        try {
            const today = misc.getToday();
            const from = today.toISOString();
            const destDate = misc.addDays(today, 6);
            const to = destDate.toISOString();
            
            const ret = await httpClient.post(`https://opendata.tamk.fi/r1/reservation/search?apiKey=${keys.openDataKey}`, {
                startDate: from,
                studentGroup: [classId]
            });
            return ret.data.reservations || [];
        } catch(e) {
            console.log(e);
            return [];
        }
    },
    formatSchedule: function(reservations) {
        let scheduleData = {};

        reservations.forEach(reservation => {
            const reservationStart = new Date(reservation.startDate);
            const reservationEnd = new Date(reservation.endDate);
            
            const reservationKey = reservationStart.getDate() + "-" + reservationStart.getMonth();
            
            if (!scheduleData[reservationKey]) {
                scheduleData[reservationKey] = {
                    weekDay: misc.getDayOfWeek(reservation.startDate),
                    day: String(reservationStart.getDate()).padStart(2, '0') + "." 
                        + String(reservationStart.getMonth() + 1).padStart(2, '0') + "." 
                        + String(reservationStart.getFullYear()).padStart(2, '0'),
                    events: []
                };
            }

            let eventInfo = {
                startTime: String(reservationStart.getHours()).padStart(2, '0') + ":" + String(reservationStart.getMinutes()).padStart(2, '0'),
                endTime: String(reservationEnd.getHours()).padStart(2, '0') + ":" + String(reservationEnd.getMinutes()).padStart(2, '0'),
                time: String(reservationStart.getHours()).padStart(2, '0') + ":" + String(reservationStart.getMinutes()).padStart(2, '0'),
                locations: [],
                realizations: [],
                subject: reservation.subject || null,
                info: []
            };

            reservation.resources.forEach(resource => {
                if (resource.type === 'room') {
                    eventInfo.locations.push({
                        code: resource.code || null,
                        name: resource.name || null,
                    });
                } else if (resource.type === 'realization') {
                    eventInfo.realizations.push({
                        code: resource.code || null,
                        name: resource.name || null
                    });
                } 
            });

            if (eventInfo.realizations[0]) {
                eventInfo.info.push(eventInfo.realizations[0].name);
                eventInfo.realizations.forEach(realization => {
                    eventInfo.info.push(realization.code);
                });
            } else if (eventInfo.subject) {
                eventInfo.info.push(eventInfo.subject);
            }

           
            eventInfo.locations.forEach(location => {
                eventInfo.info.push(location.code);
            });

            scheduleData[reservationKey].events.push(eventInfo);
        });

        return Object.values(scheduleData);
    },
    cleanSchedule: function(days) {
        let cleaned = [];
        let mostRows = 0;

        const longest = 27;

        days.forEach(function(day) {
            let titleDivider = "";
            let dayDivider = "";
            for(let i = 0; i < longest; i++) {
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
                dayContent += `${event.startTime} - ${event.endTime}`;
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
            cleaned.push({day: dayContent.split("\n")});
        });
        let render = "";
        for(let i = 0; i<mostRows; i++) {
            for(let j = 0; j<cleaned.length; j++) {
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
    },
    validClassId: function(classId) {
        let valid = true;
        if (typeof classId !== "string") {
            valid = false;
        } else {
            if (classId.split(".").length > 1) 
                valid = false;
            
            if (classId.length > 20)
                valid = false;
        }
        return valid;
    },
    prodDebug: function() {
        const today = misc.getToday();
        const from = today.toISOString();
        const destDate = misc.addDays(today, 6);
        const to = destDate.toISOString();
        
        axios.post(`https://opendata.tamk.fi/r1/reservation/search?apiKey=${keys.openDataKey}`, {
            startDate: from,
            endDate: to,
            studentGroup: ["19TIETOB"]
        })
        .then(res => {
            console.log("RECEIVED DATA");
            console.log(res);
        })
        .catch(err => {
            console.log("HERES THE ERR");
            console.log(err);
        });
    }
};
