const express = require('express');
const axios = require('axios');
const util = require('./util');

const router = new express.Router();

router.get('/', (req, res) => {
    axios.get('https://www.campusravita.fi/fi/ravintolat-ja-kahvila')
    .then(function(response) {
        const data = util.cleanUp(response.data);
        const longest = data.longest;
        const finalData = data.data;
        let resContent = "";
        resContent += `\nRuokeliste\n`;
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
        res.send(resContent);
    })
    .catch(function(err) {
        console.log(err);
    });
    
});

module.exports = router;