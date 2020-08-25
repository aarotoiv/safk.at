const express = require('express');
const axios = require('axios');
const util = require('./util');
const keys = require('./keys');

const router = new express.Router();

const Cache = require('./cache');
const cacheInst = new Cache();

const LukkariBot = require('./lukkaribot');

const bot = new LukkariBot();
bot.initialize().then(_ => {
    console.log("Bot initialized");
})
.catch(err => {
    console.log("ERROR INITIALIZING BOT: ", err);
});

router.get('/', cacheInst.seekExistingMenu, async (req, res) => { 
    const forceJson = req.query.json == 'true';
    let content = {
        headers: [],
        everything: []
    };

    if(req.existingMenu) 
        content = req.existingMenu;
    else {
        try {
            const res = await axios.get("http://fi.jamix.cloud/apps/menuservice/rest/haku/menu/97603/1?lang=fi")
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
            const dateForComp = String(today.getFullYear()) 
                + String(today.getMonth() + 1).padStart(2, '0')
                + String(today.getDate()).padStart(2, '0');
            
            for (menuItem of menu.days) {
                if (menuItem.date == dateForComp) {
                    menuItem.mealoptions.forEach(option => {
                        content.headers.push(option.name);
                        content.everything.push(option.name);
    
                        option.menuItems.forEach(item => {
                            content.everything.push(item.name + " " + (item.diets ? item.diets : ""));
                        });
                    });
                    break;
                }
            }

        } catch(err) {
            sendErr();
            return;
        }
    }

    if (!req.existingMenu && content.headers && content.headers.length > 0) {
        cacheInst.saveMenu(content);
    }

    if(forceJson) {
        res.json(content);
    } else if(util.showWebsite(req.device.type)) {
        res.render('index', {content: content});
    } else {
        res.send(content.headers.length > 0 ? util.cleanMenu(content) : "No menu available.\n");
    }
});

router.get('/source', cacheInst.getDoorOpen, (req, res) => {
    if (req.query && req.query.secret) {
        if (req.query.secret == keys.sourceSecret) {
            cacheInst.saveDoorOpen(req.query.val);
            res.send("updated");
        } else {
            res.send("nope.");
        }
    } else {
        res.send(req.isDoorOpen == "true" ? "Door is open" : "Door is closed");
    }
});

router.get('/:class', cacheInst.seekExistingPlan, async (req, res) => {
    const forceJson = req.query.json == 'true';
    const luokka = req.params.class;

    let days = req.existingData ? req.existingData : [];

    if (days.length == 0) {
        const today = new Date();
        today.setTime(today.getTime() + (3 * 60 * 60 * 1000));
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
        const sched = await bot.getSched(from, to);
        await bot.deleteClass(luokka.toUpperCase());

        let ret = {};
        sched.forEach((schedItem) => {
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