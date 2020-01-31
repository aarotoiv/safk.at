module.exports = {
    cleanMenu: function(content) {
        let finalData = [];
        let longest = 0;
        
        for(let i = 0; i < content.headers.length; i++) {
            finalData[i] = {
                header: content.headers[i],
                contents: []
            };
            if(content.headers[i].length > longest)
                longest = content.headers[i].length;
        }
        let dataIndex = -1;
        for(let i = 0; i < content.everything.length; i++) {
            if(content.headers.includes(content.everything[i])) 
                dataIndex++;
            else {
                if(finalData[dataIndex])
                    finalData[dataIndex].contents.push(content.everything[i]);
            }
            if(content.everything[i].length > longest)
                longest = content.everything[i].length;
        }
        let resContent = "";
        let bar = "";
        let nlSpacing = "";
        for(var i = 0; i<=longest+4; i++) {
            bar += "─";
            nlSpacing += " ";
        }
        resContent += `┌${bar}┐\n`;
        for(let i = 0; i<finalData.length; i++) {
            resContent += `│${bar}│\n`;
            let headerValue = finalData[i].header;
            for(let j = 0; j<longest+3 - finalData[i].header.length; j++) {
                headerValue += " ";
            }
            resContent += `│ ${headerValue} │\n`;
            resContent += `│${bar}│\n`;
            for(let j = 0; j<finalData[i].contents.length; j++) {
                const content = finalData[i].contents[j];
                resContent += `│ ${content} `;
                for(let z = 0; z<longest+3 - content.length; z++) {
                    resContent += " ";
                }
                resContent += "│\n";
            }
            resContent += `│${nlSpacing}│\n`;
        }
        resContent += `└${bar}┘\n`;
        
        return resContent;
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
                //console.log(line);
                render += `│${(line ? line : "") + spacing} `;                
            }
            render += "\n";
        }
        return render;
    },
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
}