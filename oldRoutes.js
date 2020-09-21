const express = require('express');
const keys = require('./keys');
const util = require('./util');

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
    const forceJson = req.query.json !== undefined && req.query.json != "false";
    const content = req.existingMenu || await util.menu.fetchMenu();

    if (!req.existingMenu && content.headers && content.headers.length > 0) 
        cacheInst.saveMenu(content);

    if(forceJson) 
        res.json(content);
    /*else if(util.misc.showWebsite(req.device.type))
        res.render('index', {content: content});*/
    else
        res.send(content.headers.length > 0 ? util.menu.cleanMenu(content) : "No menu available.\n");
});

router.post('/source', (req, res) => {
    if (req.body && req.body.data) {
        try {
            const data = JSON.parse(req.body.data);
	        const token = data.token;
            const value = data.val;
            if (token === keys.sourceSecret) 
                cacheInst.saveDoorOpen(value);

        } catch(err) {
            console.log(err);
        } finally {
            res.sendStatus(200);
        }   
    } else {
        res.sendStatus(400);
    }
});

router.get('/source', cacheInst.getDoorOpen, (req, res) => {
    const forceJson = req.query.json !== undefined && req.query.json != "false";
    
    if (forceJson) 
        res.json({ doorOpen: req.isDoorOpen == "true" });
    /*else if (util.misc.showWebsite(req.device.type))
        res.render('source', { isDoorOpen: req.isDoorOpen == "true" });*/
    else
        res.send(req.isDoorOpen == "true" ? "Door is open\n" : "Door is closed\n");
    
});

router.get('/:class', cacheInst.seekExistingPlan, async (req, res) => {
    const forceJson = req.query.json !== undefined && req.query.json != "false";
    const luokka = req.params.class;

    const today = util.misc.getToday();
    const from = util.misc.parseDateString(today);
    const destDate = util.misc.addDays(today, 7);
    const to = util.misc.parseDateString(destDate);

    let days = req.existingData ? req.existingData : [];
    
    if (days.length == 0) {
        if (bot.isUnavailable())
            await bot.isAvailable();
        await bot.addClass(luokka.toUpperCase());
        const sched = await bot.getSched(from, to);
        await bot.deleteClass(luokka.toUpperCase());
        days = util.sched.formatSchedule(sched, from);
    }

    if (!req.existingData && days.length > 0) 
        cacheInst.savePlan(luokka, days);

    if (forceJson) 
        res.json(days);
    /*else if(util.misc.showWebsite(req.device.type))
        res.render('sched', { content: days, from, to });*/
    else {
        res.send(
            days.length > 0 
            ? util.sched.cleanSchedule(util.sched.limitInfoLength(days, 25)) 
            : "Did you use a correct classId?\n"
        );
    }
});

module.exports = router;
