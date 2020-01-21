const express = require('express');
const axios = require('axios');

const router = new express.Router();

router.get('/', (req, res) => {
    let finalData = [];
    axios.get('https://www.campusravita.fi/fi/ravintolat-ja-kahvila')
    .then(function(response) {
        let data = response.data;
        let datanew = data.split('\n');
        let foundIndex = -1;
        for(let i = 0; i<datanew.length; i++) {
            if(datanew[i].includes('<div class="view-ruokalista">')) {
                foundIndex = i;
            }
        }
        let new_arr = [];
        if(foundIndex != -1) {
            for(let i = foundIndex; i<foundIndex + 100; i++) {
                new_arr.push(datanew[i]);
            }
        }
        let foundIndexAgain = -1;
        for(let i = 0; i<new_arr.length; i++) {
            if(new_arr[i].includes('</section>')) {
                foundIndexAgain = i;
                break;
            }
        }
        for(let i = 0; i<foundIndexAgain; i++) {
            new_arr[i] = new_arr[i].split("<").join("\n<");
        }

        for(let i = 0; i<foundIndexAgain; i++) {
            new_arr[i] = new_arr[i].split('<div class="views-row">').join("");
            new_arr[i] = new_arr[i].split('</div>').join("");
        
        }

        new_arr = new_arr[0].split("\n");
        
        new_arr = new_arr.slice(0, -7);
        new_arr.splice(0, 2);

        let curSection = -1;
        let ongoingSection = false;
        for(let i = 0; i<new_arr.length; i++) {
            if(new_arr[i].includes("<h3>")) {
                ongoingSection = true;
                curSection++;
                finalData[curSection] = {
                    header: "",
                    contents: []
                };
            }
            if(curSection > -1) {
                let shouldAdd = true;
                if(new_arr[i].includes("</h3>")) {
                    ongoingSection = false; 
                    shouldAdd = false;
                }
                if(shouldAdd) {
                    if(ongoingSection == true) {
                        finalData[curSection].header += new_arr[i].replace("<h3>", "");
                    } else {
                        let data = new_arr[i];
                        if(data.length > 2) {
                            finalData[curSection].contents.push(new_arr[i]);
                        }
                    }
                }
                
            }
                
        }
        console.log(finalData);
        let resContent = "";
        resContent += "RUOKELISTE BY TOIVOTON\n"
        resContent += "-----------------------------------------------------\n";
        for(let i = 0; i<finalData.length; i++) {
            resContent += `${finalData[i].header}\n`;

            for(let j = 0; j<finalData[i].contents.length; j++) {
                resContent += `\t${finalData[i].contents[j]}\n`;
                
            }
            resContent += "\n";
        }
        resContent += "\n";
        resContent += "-----------------------------------------------------\n";
        res.send(resContent);

        console.log(finalData);
        //console.log(res.data);
    })
    .catch(function(err) {
        console.log(err);
    });
    
});

module.exports = router;