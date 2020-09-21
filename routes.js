const express = require('express');
const keys = require('./keys');
const util = require('./util');
const axios = require('axios');
const path = require('path');

const router = new express.Router();

const Cache = require('./cache');
const cacheInst = new Cache();

router.get('/', cacheInst.seekExistingMenu, async (req, res) => {
    const forceJson = req.query.json !== undefined && req.query.json != "false";
    const content = req.existingMenu || await util.menu.fetchMenu();

    if (!req.existingMenu && content.simplified.headers.length > 0) 
        cacheInst.saveMenu(content);

    if(forceJson) 
        res.json(content.formatted);
    else if (util.misc.showWebsite(req.device.type)) 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    else
        res.send(content.simplified.headers.length > 0 ? util.menu.cleanMenu(content.simplified) : "No menu available.\n");
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
    else if (util.misc.showWebsite(req.device.type)) 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    else
        res.send(req.isDoorOpen == "true" ? "Door is open\n" : "Door is closed\n");
    
});

router.get('/:class', cacheInst.seekExistingPlan, async (req, res) => {
    const forceJson = req.query.json !== undefined && req.query.json != "false";
    const classId = req.params.class;

    const today = util.misc.getToday();
    const from = today.toISOString();
    const destDate = util.misc.addDays(today, 6);
    const to = destDate.toISOString();

    const days = req.existingData 
        || util.sched.formatSchedule(await util.sched.fetchSchedule(from, to, classId));

    if (!req.existingData && days.length > 0)
        cacheInst.savePlan(classId, days);

    if (forceJson) 
        res.json(days);
    else if (util.misc.showWebsite(req.device.type)) 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    else {
        res.send(days.length > 0
            ? util.sched.cleanSchedule(util.sched.limitInfoLength(days, 25))
            : "Did you use a correct classId?\n"
        );
    }
});

module.exports = router;
