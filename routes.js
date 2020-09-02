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
    const forceJson = req.query.json == 'true';
    const content = req.existingMenu || await util.menu.fetchMenu();

    if (!req.existingMenu && content.headers && content.headers.length > 0) 
        cacheInst.saveMenu(content);

    if(forceJson) 
        res.json(content);
    else if(util.misc.showWebsite(req.device.type))
        res.render('index', {content: content});
    else
        res.send(content.headers.length > 0 ? util.menu.cleanMenu(content) : "No menu available.\n");
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
        if (util.misc.showWebsite(req.device.type)) {
            res.render('source', { isDoorOpen: req.isDoorOpen == "true" });
        } else {
            res.send(req.isDoorOpen == "true" ? "Door is open\n" : "Door is closed\n");
        }
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

        days = util.sched.formatSchedule(sched, from);
    }

    if (!req.existingData && days.length > 0) 
        cacheInst.savePlan(luokka, days);

    if (forceJson) 
        res.json(days);
    else if(util.misc.showWebsite(req.device.type))
        res.render('sched', {content: days});
    else 
        res.send(days.length > 0 ? util.sched.cleanSchedule(days) : "Did you use a correct classId?\n");
});

module.exports = router;