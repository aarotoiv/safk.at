const express = require('express');
const keys = require('./keys');
const util = require('./util');
const path = require('path');
const analytics = require('./analytics')

const router = new express.Router();

const Cache = require('./cache');
const cacheInst = new Cache();

router.get('/', cacheInst.seekExistingMenu, async (req, res) => {
  if (util.misc.showWebsite(req.device.type))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  else {
    const content = req.existingMenu || await util.menu.fetchMenu();
    if (!req.existingMenu && content.simplified.headers.length > 0)
      cacheInst.saveMenu(content);

    res.send(content.simplified.headers.length > 0 ? util.menu.cleanMenu(content.simplified) : "No menu available.\n");
  }
});

router.get('/api/menu', cacheInst.seekExistingMenu, async (req, res) => {
  const content = req.existingMenu || await util.menu.fetchMenu();
  if (!req.existingMenu && content.simplified.headers.length > 0)
    cacheInst.saveMenu(content);

  res.json(content.formatted);
});

router.post('/source', (req, res) => {
 if (req.body && req.body.data) {
    try {
      const data = JSON.parse(req.body.data);
      const token = data.token;
      const value = data.val;
      if (token === keys.sourceSecret)
        cacheInst.saveDoorOpen(value);

    } catch (err) {
      console.log(err);
    } finally {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
});

router.get('/source', cacheInst.getDoorOpen, (req, res) => {
  if (util.misc.showWebsite(req.device.type))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  else
    res.send(req.isDoorOpen == "true" ? "Door is open\n" : "Door is closed\n");
});

router.get('/api/source', cacheInst.getDoorOpen, (req, res) => {
  res.json({ doorOpen: req.isDoorOpen == "true" });
});

router.post('/api/octo', (req, res) => {
  res.sendStatus(200);
})

router.get('/:class', cacheInst.seekExistingPlan, async (req, res) => {
  const classId = req.params.class;

  if (!util.sched.validClassId(classId)) {
    res.sendStatus(404);
    return;
  }

  if (util.misc.showWebsite(req.device.type))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  else {
    const days = req.existingData
      || util.sched.formatSchedule(await util.sched.fetchSchedule(classId), classId);

    if (!req.existingData && days.length > 0)
      cacheInst.savePlan(classId, days);

    res.send(days.length > 0
      ? util.sched.cleanSchedule(util.sched.limitInfoLength(days, 25))
      : "Did you use a correct classId?\n"
    );
  }
});

router.get('/api/:class', cacheInst.seekExistingPlan, async (req, res) => {
  const classId = req.params.class;
  if (!util.sched.validClassId(classId)) {
    res.sendStatus(404);
    return;
  }
  const days = req.existingData
    || util.sched.formatSchedule(await util.sched.fetchSchedule(classId), classId);
  if (!req.existingData && days.length > 0)
    cacheInst.savePlan(classId, days);

  res.json(days);
});

router.get('/admin/analytics', analytics.checkAdminKey, async (req, res) => {
  const requests = analytics.getRequests()
  const requestEntries = Object.entries(requests).sort(([a_, aValue], [b_, bValue]) => bValue - aValue);
  let ret = ''
  for (const [key, value] of requestEntries) {
    ret += `URL: ${key}: COUNT: ${value}\n`
  }
  res.send(ret)
})

module.exports = router;
