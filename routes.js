const express = require('express');
const osmosis = require('osmosis');
const util = require('./util');

const router = new express.Router();

const Cache = require('./cache');
const cacheInst = new Cache();

const LukkariBot = require('./lukkaribot');

const bot = new LukkariBot();
bot.initialize().then(res => {
    console.log("Bot initialized");
})
.catch(err => {
    console.log(err);
});

router.get('/', cacheInst.seekExistingMenu, (req, res) => { 
    const forceJson = req.query.json == 'true';

    if(req.existingMenu) {
        const content = req.existingMenu;
        if(forceJson) {
            res.json(content);
        } else if(util.showWebsite(req.device.type)) {
            res.render('index', {content: content});
        } else {
            res.send(content.headers.length > 0 ? util.cleanMenu(content) : "No menu available.\n");
        }
    } else {
        osmosis
        .get('https://opiskelijanverkkokauppa.fi/fi/ruokalista')
        .find('.view-ruokalista')
        .set({
            headers: ['h3'],
            everything: ['h3, div.views-row']
        })
        .data(content => {
            //debug data
            //content.headers = ["aa", "aaa", "aaaa", "aaaaa", "aaaa aaaa"];
            //content.everything = ["aa", "kysta", "asdfasfdasdf", "aaa", "mitä", "asdfasdfasdfasdf", "hehe", "aaaa", "juju", "jaja", "jooo", "aaaaa", "heheheh", "hehehehehheee", "heheheheee", "aaaa aaaa", "huuu", "haaa"];
            if (!res.headersSent) {
                cacheInst.saveMenu(content);
                if(forceJson) {
                    res.json(content);
                } else if(util.showWebsite(req.device.type)) {
                    res.render('index', {content: content});
                } else {
                    res.send(content.headers.length > 0 ? util.cleanMenu(content) : "No menu available.\n");
                }
            }
        });
    }
    
});

router.get('/:class', cacheInst.seekExistingPlan, async (req, res) => {
    const forceJson = req.query.json == 'true';
    const luokka = req.params.class;

    let days = req.existingData ? req.existingData : [];

    if (days.length == 0) {
        const today = new Date();
        const from = String(today.getFullYear()) 
            + "-"
            + String(today.getMonth() + 1).padStart(2, '0')
            + "-"
            + String(today.getDate()).padStart(2, '0');
        today.setDate(today.getDate() + 7);
        const to = String(today.getFullYear()) 
            + "-"
            + String(today.getMonth() + 1).padStart(2, '0')
            + "-"
            + String(today.getDate()).padStart(2, '0');

        await bot.addClass(luokka.toUpperCase());
        const sched = await bot.getSched("2020-08-31", "2020-09-07");
        await bot.deleteClass(luokka.toUpperCase());

        let ret = {};
        sched.forEach((schedItem) => {
            console.log(schedItem);
            const startDate = schedItem.start_date;
            const endDate = schedItem.end_date;
            const dateString = startDate.split(" ")[0];
            if (!ret[dateString]) {
                ret[dateString] = {};
                ret[dateString].longest = 27;
                ret[dateString].day = dateString;
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
            
            eventInfo.info.forEach((info, i) => {
                if (info.length > 25) {
                    eventInfo.info[i] = info.substring(0, 25);
                    eventInfo.info[i] += "..";
                }
            });

            ret[dateString].events.push(eventInfo);
            
        });

        days = Object.values(ret);
    }

    if(days && days != [] && days.length > 1) {
        if(!req.existingData) 
            cacheInst.savePlan(luokka, days);

        if(forceJson) {
            res.json(days);
        } else if(util.showWebsite(req.device.type)) {
            res.render('sched', {content: days});
        } else {
            const cleaned = util.cleanSchedule(days);
            res.send(cleaned);
        }
    } else {
        if(forceJson) {
            res.json({});
        } else if(util.showWebsite(req.device.type)) {
            res.render('sched', {content: []});
        } else 
            res.send("Did you use a correct classId?\n");
    }
});

module.exports = router;