module.exports = {
    cleanUp: function(content) {
        let finalData = [];
        let longest = 0;
        
        for(let i = 0; i<content.headers.length; i++) {
            for(let j = 0; j<content.everything.length; j++) {
                if(content.headers[i] == content.everything[j]) 
                    content.everything[j] = "n";
            }
        }
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
            if(content.everything[i] == "n") 
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
        resContent += `╭${bar}╮\n`;
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
                for(let i = 0; i<longest+3 - content.length; i++) {
                    resContent += " ";
                }
                resContent += "│\n";
                
            }
            resContent += `│${nlSpacing}│\n`;
        }
        resContent += `╰${bar}╯\n`;
        
        return resContent;
    },
    showWebsite: function(type) {
        if(type == "phone" || type == "desktop") 
            return true;
        return false;
    }
}