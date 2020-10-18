const axios = require('axios');
const httpClient = axios.create();
httpClient.defaults.timeout = 2000;

module.exports = {
    fetchMenu: async function() {
        let content = {
            simplified: {
                headers: [],
                everything: []
            },
            formatted: []
        };
    
        try {
            const res = await httpClient.get("http://fi.jamix.cloud/apps/menuservice/rest/haku/menu/97603/1?lang=fi");
            if (res.data.length < 1 
                || res.data[0].menuTypes.length < 1
                || res.data[0].menuTypes[0].menus.length < 1) {
                sendErr();
                return;
            }
            const menuTypes = res.data[0].menuTypes;
            const menu = menuTypes[0].menus[0];
            
            if (menu.days.length < 1) {
                sendErr();
                return;
            }
    
            const today = new Date();
            // Just doing this because server uses UTC time.
            // CBA
            today.setTime(today.getTime() + (3 * 60 * 60 * 1000));
            today.setDate(today.getDate() + 1);
            const dateForComp = String(today.getFullYear()) 
                + String(today.getMonth() + 1).padStart(2, '0')
                + String(today.getDate()).padStart(2, '0');
            
            for (menuItem of menu.days) {
                if (menuItem.date == dateForComp) {
                    menuItem.mealoptions.forEach(option => {
                        const mealOption = {
                            header: option.name,
                            items: []
                        };
                        content.simplified.headers.push(option.name);
                        content.simplified.everything.push(option.name);
    
                        option.menuItems.forEach(item => {
                            const itemName = item.name + " " + (item.diets ? item.diets : "");
                            mealOption.items.push(itemName);
                            content.simplified.everything.push(itemName);
                        });
                        content.formatted.push(mealOption);
                    });
                    break;
                }
            }
    
        } catch(err) {
            console.log(err);
        } finally {
            return content;
        }
    },
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
    }
};